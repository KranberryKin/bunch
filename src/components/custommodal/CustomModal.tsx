import React, { useEffect, useState } from "react";
import "./custommodal.css";

export interface ICustomModalProps {
    header_content?: React.ReactNode;
    body_content?: React.ReactNode;
    footer_content?: React.ReactNode;
    callback_function?: () => any;
}


const CustomModal = ({header_content, body_content, footer_content, callback_function}:ICustomModalProps) => {
    
    const [isClosed, setIsClosed] = useState<boolean>(true);

    const closeModal = () => {
        if(callback_function){
            callback_function();
        }
            setIsClosed(true);
    }

    const defaultHeader: React.ReactNode = <div className="custom-modal-header" onClick={() => closeModal()}>X</div>;

    const defaultBody = <p>This needs to be set.</p>;

    const [modalContent, setModalContent] = useState<{
        header: React.ReactNode, 
        body: React.ReactNode, 
        footer: React.ReactNode, 
    }>({
        header: header_content ? <>{header_content}</> : defaultHeader,
        body: body_content ? <>{body_content}</> : defaultBody,
        footer: footer_content ? <>{footer_content}</> : <></>,
    });
    
    useEffect(() => {
        if(header_content || body_content || footer_content){
            setModalContent({
                header: header_content ? <>{header_content}</> : defaultHeader,
                body: body_content ? <>{body_content}</> : defaultBody,
                footer: footer_content ? <>{footer_content}</> :  <></>,
            });
            setIsClosed(false);
        }else if(!header_content && !body_content && !footer_content){
            setIsClosed(true);
        }
    }, [header_content, body_content, footer_content]);
    


    return (
    <div className="custom-modal-content" hidden={isClosed}>
        <div className="custom-modal-content-header">{modalContent.header}</div>
        <div  className="custom-modal-content-body">{modalContent.body}</div>
        <div  className="custom-modal-content-footer">
            {modalContent.footer}
        </div>
    </div>
    );
};
export default CustomModal;