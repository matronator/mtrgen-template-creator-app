import { useEffect, useState } from "react";
import { PrismLight } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import darcula from 'react-syntax-highlighter/dist/esm/styles/prism/darcula';
import { Alert, Button, Col, Modal } from "react-bootstrap";
import { Convert, Template } from "../Schema";
import { useCopyToClipboard } from "usehooks-ts";
import { EventsOn } from "../../../wailsjs/runtime/runtime";

interface OutputModalProps {
    show: boolean;
    onHide?: () => void;
    template: Template;
}

export function OutputModal(props: OutputModalProps) {
    const [ show, setShow ] = useState(props.show);
    const [ visible, setVisible ] = useState(false);
    const [ copied, copy ] = useCopyToClipboard();
    const output = Convert.templateToJson(props.template);

    PrismLight.registerLanguage('json', json);

    useEffect(() => {
        if (visible) {
            setTimeout(() => setVisible(false), 3000);
        }
    }, [visible]);

    function handleCopy() {
        copy(output);
        setVisible(true);
    }

    EventsOn('onExportToJSON', () => setShow(true));

    return (
        <>
            {/* <Button variant="primary" onClick={() => setShow(true)}>Export to JSON</Button> */}

            <Modal show={show} onHide={() => setShow(false)} size="xl" className="modal-xxl">
                <Modal.Header closeButton>
                    <Modal.Title className="text-black">Exported JSON Template</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PrismLight language={json} style={darcula} customStyle={{maxHeight: 400}}>
                        {output}
                    </PrismLight>
                </Modal.Body>
                <Modal.Footer>
                    <Col className="w-25 text-left">
                        <Button variant="danger" onClick={() => setShow(false)}>
                            Close
                        </Button>
                    </Col>
                    <Col sm={6} className="w-75 text-right">
                        <Alert variant="warning" show={visible} className="me-2 d-inline-block my-0 py-1">Copied!</Alert>
                        <Button className="me-2" variant="primary" onClick={handleCopy}>
                            <i className="fa fa-clone"></i> Copy JSON
                        </Button>
                        <a className="btn btn-success" href={`data:text/json;charset=utf-8,${encodeURIComponent(output)}`} download={`${props.template.name}.json`}>
                            <i className="fa fa-download"></i> Download as file
                        </a>
                    </Col>
                </Modal.Footer>
            </Modal>
        </>
    );
}
