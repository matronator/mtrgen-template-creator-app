import './style.css';
import './accordion.css';
import { MTRGenTemplateEditor } from 'mtrgen-template-editor';
import { useEffect, useState } from 'react';
import { LoadFile, SaveFile } from '../wailsjs/go/main/App';
import { EventsOff, EventsOn } from '../wailsjs/runtime/runtime';
import { OutputModal } from './components/OutputModal/OutputModal';
import { Convert, Template } from './components/Schema';
import { AlertToast, AlertToastProps } from './components/Toast/AlertToast';
import { generateUUID } from './utils';

function App() {
    const [template, setTemplate] = useState<Template>({
        name: 'Template',
        filename: '<%name%>Template',
        path: '<%path%>',
        file: {},
    });
    const [alerts, setAlerts] = useState<AlertToastProps[]>([]);

    async function handleOnNewFile(empty: boolean) {
        const id = generateUUID();
        setTemplate(empty ? {
            name: '',
            filename: '',
            path: '',
            file: {},
        } : {
            name: 'Template',
            filename: '<%name%>Template',
            path: '<%path%>',
            file: {},
        });
        setAlerts(prevVal => prevVal.concat({
            id: id,
            variant: 'success',
            show: true,
            text: `New ${empty ? 'empty ' : ''}file created.`,
            onHide: () => setAlerts(prevVal => prevVal.filter(alert => alert.id !== id)),
        }));
    }

    async function handleOnSaveFile() {
        console.log('Saving file...');
        const saved = await SaveFile(Convert.templateToJson(template), `${template.name}`);
        const id = generateUUID();
        let variant = 'danger';

        if (saved === 'File saved successfully.') {
            variant = 'success';
        }
        setAlerts(prevVal => prevVal.concat({
            id: id,
            variant: variant,
            show: true,
            text: saved,
            onHide: () => setAlerts(prevVal => prevVal.filter(alert => alert.id !== id)),
        }));
    }

    async function handleOnLoadFile() {
        const data = await LoadFile();
        console.log(data);
        const id = generateUUID();
        try {
            const newTemplate = Convert.toTemplate(data);
            console.log(newTemplate);
            setTemplate(newTemplate);
            setAlerts(prevVal => prevVal.concat({
                id: id,
                variant: 'success',
                show: true,
                text: 'File loaded successfully.',
                onHide: () => setAlerts(prevVal => prevVal.filter(alert => alert.id !== id)),
            }));
        } catch (error) {
            setAlerts(prevVal => prevVal.concat({
                id: id,
                variant: 'danger',
                show: true,
                text: 'File couldn\'t be loaded, template may not be valid.',
                onHide: () => setAlerts(prevVal => prevVal.filter(alert => alert.id !== id)),
            }));
        }
    }
    
    useEffect(() => {
        EventsOn('onSaveFile', handleOnSaveFile);
        EventsOn('onLoadFile', handleOnLoadFile);
        EventsOn('onNewFile', (empty: boolean) => handleOnNewFile(empty));
        return () => {
            EventsOff('onSaveFile');
            EventsOff('onLoadFile');
            EventsOff('onNewFile');
        };
    }, []);


    return (
        <div className="container-md mtrgen mx-auto">
            <div className="nav d-flex justify-content-between">
                <div className="nav-item">
                    <OutputModal show={false} template={template} onDownload={handleOnSaveFile} />
                </div>
            </div>
            <div className="toast-alert-wrapper">
                {alerts.reverse().map((alert) =>
                    <AlertToast key={alert.id} show={true} id={alert.id} onHide={alert.onHide} variant={alert.variant} text={alert.text} />
                )}
            </div>
            <MTRGenTemplateEditor setTemplate={setTemplate} template={template} onTemplateChange={(temp) => setTemplate(temp) } />
        </div>
    );
}

export default App;
