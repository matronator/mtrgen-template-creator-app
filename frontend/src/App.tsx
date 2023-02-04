import './style.css';
import { useState } from 'react';
import { Template } from './components/Schema';
import { OutputModal } from './components/OutputModal/OutputModal';
import { MTRGenTemplateEditor } from 'mtrgen-template-editor';

function App() {
    const [template, setTemplate] = useState<Template>({
        name: 'Template',
        filename: '<%name%>Template',
        path: '<%path%>',
        file: {

        }
    });

    return (
        <div className="container-md mtrgen mx-auto">
            <div className="nav d-flex justify-content-between">
                <div className="nav-item">
                    <OutputModal show={false} template={template} />
                </div>
            </div>
            <MTRGenTemplateEditor onTemplateChange={(temp) => setTemplate(temp)} />
        </div>
    );
}

export default App;
