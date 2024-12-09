
import { useState } from 'react';
import '../../componets/styles/varracoStyles/V_Search.css';
import {Modal} from '../../componets/modal';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import EngordarUpdate from './engordarUpdate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare} from '@fortawesome/free-solid-svg-icons';

const auth = getAuth(firebase);

/**
 * 
 * @param {visible} props provided visible={boolean}
 * @returns a view with the search information.
 */

export default function EngordarSearch(props) {

    const collectionName = `Verraco-${auth.currentUser.uid}`;
    const {visible, generalSearchData, setGeneralSearchData, removeInfoFromSearch } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateId, setUpdateId] = useState('')
    const [removeItem, setRemoveItem] = useState({
        id: '',
        item: ''
    });




function handleOpenRemoveModal(id, item) {
        setIsOpen(true);
        setRemoveItem({ id, item });

 }

const remove = async (id) => {

     removeInfoFromSearch(collectionName, id).then(() => {
            setIsOpen(false);
     }).catch((e) => {
            console.error(e);
        })
 }


function openUpdateModal(id) {
     setShowUpdate(true);
     setUpdateId(id);
}

    return (
        <>
          {visible?(
                <main className="E_S_conatainer">
                <section className="E_info_container">
    
    
                    {generalSearchData.length > 0 ? (generalSearchData.map((list, index) => <div className="E_info_body" key={index}>
    
    
                        <header className="E_info_header">
                            <p className="E_info_header_title">Engordar {index + 1}</p>
    
                            <div className="E_info_header_btn">
    
                                <span className="V_info_header_delete" onClick={() => openUpdateModal(list.id)}>
                                     <FontAwesomeIcon icon={faPenToSquare} color={'#fff'} />
                                </span>
                                <span className="V_info_header_delete" onClick={()=>handleOpenRemoveModal(list.id)}>
                                     <FontAwesomeIcon icon={faTrash} color={'#fff'} />
                                </span>  
                            </div>
    
                        </header>
    
                        <div>
                            <p className="E_info_text"><span className="E_info_text2" >Fecha del destete:</span > {list.FechaDelDestete}</p>
                            <p className="E_info_text"><span className="E_info_text2">No Lechones:</span > {list.NoLechones}</p>
                            <p className="E_info_text"><span className="E_info_text2" >Inicio:</span > {list.Inicio}</p>
                            <p className="E_info_text"><span className="E_info_text2" >Crecimiento:</span > {list.Crecimiento}</p>
                            <p className="E_info_text"><span className="E_info_text2" >Desarrolo:</span > {list.Desarrolo}</p>
                            <p className="E_info_text"><span className="E_info_text2" >Engorda:</span > {list.Engorda}</p>
                        </div>
    
                    </div>
                    )) : (
                        <></>
                    )}
    
    
                </section>
    
                <Modal
                    visible={isOpen}
                    title={'Esta seguro que deseas eliminar esta información?'}
                    button1={'Descartar'}
                    button2={'Borrar'}
                    fnButton1={() => setIsOpen(false)}
                    fnButton2={() => remove(removeItem.id)}
                /> 
    
    
                <EngordarUpdate 
                    visible={showUpdate}  
                    id={updateId} 
                    showUpdate={showUpdate} 
                    setShowUpdate={setShowUpdate} 
                    generalData={generalSearchData} 
                    setGeneralData={setGeneralSearchData} 
               />
    
    
            </main>
          ):(<></>)}
        </>
      
    )
}