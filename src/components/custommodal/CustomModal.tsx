import React, { useEffect, useState } from "react";
import "./custommodal.css";
import Button from "../button/button";

export interface ICustomModalProps {
    header_content?: React.ReactNode;
    body_content?: React.ReactNode;
    footer_content?: React.ReactNode;

}


const CustomModal = ({header_content, body_content, footer_content}:ICustomModalProps) => {
    
    const [isClosed, setIsClosed] = useState<boolean>(true);

    const buttonClicked = () => {
        setIsClosed(!isClosed);
    }

    const defaultHeader = <p onClick={() => buttonClicked()}>X</p>;

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