import { Modal } from "react-bootstrap";
import { MdCancel } from "react-icons/md";
import { SiTicktick } from "react-icons/si";


export const Notification = ({show, message, onHide,isError}) => {
    return (
        <>
        <Modal
        show={show}
        onHide={onHide}
        style={{fontFamily:"fantasy"}}
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className={isError?"text-danger":"text-success"}>
          {isError?"Error":"Success"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {isError?<MdCancel style={{fontSize:"5rem"}} className="text-danger"/>:
        <SiTicktick style={{fontSize:"5rem"}} className="text-success"/>}
        <p className="text-secondary">
          {message}
        </p>
      </Modal.Body>
    </Modal> 
        </>
    )
}