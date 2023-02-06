import './style.css';

import { MTRGenTemplateEditor } from 'mtrgen-template-editor';
import { useCallback, useEffect, useState } from 'react';

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
        file: {
            
        }
    });

    const [alerts, setAlerts] = useState<AlertToastProps[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState(undefined), []);

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
        const id = generateUUID();
        try {
            const newTemplate = Convert.toTemplate(data);
            setTemplate(newTemplate);
            setLoaded(true);
            forceUpdate();
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
                text: data,
                onHide: () => setAlerts(prevVal => prevVal.filter(alert => alert.id !== id)),
            }));
        }
    }

    useEffect(() => {
        EventsOff('onSaveFile');
        EventsOff('onLoadFile');
        EventsOn('onSaveFile', () => handleOnSaveFile());
        EventsOn('onLoadFile', () => handleOnLoadFile());
        console.log(template);
    }, [template]);


    return (
        <div className="container-md mtrgen mx-auto">
            <div className="nav d-flex justify-content-between">
                <div className="nav-item">
                    <OutputModal show={false} template={template} onDownload={handleOnSaveFile} />
                </div>
            </div>
            <>
                {alerts.map((alert) =>
                    <AlertToast key={alert.id} show={true} id={alert.id} onHide={alert.onHide} variant={alert.variant} text={alert.text} />
                )}
            </>
            <MTRGenTemplateEditor template={template} onTemplateChange={(temp) => {
                if (loaded) {
                    setLoaded(false);
                } else {
                    setTemplate(temp);
                }
            }} />
        </div>
    );
}

export default App;
