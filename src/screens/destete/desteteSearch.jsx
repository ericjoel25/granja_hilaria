
import '../../componets/styles/desteteStyles/destete.css';
import '../../componets/styles/varracoStyles/verracoModalInfo.css';
import {Modal} from '../../componets/modal';
import { useState } from 'react';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import DesteteUpdate from './desteteUpdate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare,} from '@fortawesome/free-solid-svg-icons';



const auth = getAuth(firebase);


/**
 * @param {visible} props  provide the props visible={boalean}
 * @returns Open the modal with the form to set the information.
 */

export default function DesteteSearch(props) {

    const collectionName = `Destete-${auth.currentUser.uid}`;
    const { visible, generalSearchData, setGeneralSearchData, removeInfoFromSearch } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateId, setUpdateId] = useState('')
    const [removeItem, setRemoveItem] = useState({
        id: '',
        item: ''
    });


    function handleOpenRemove(id, item) {
        setIsOpen(true);
        setRemoveItem({ id, item });

    }

    const remove = async (id) => {

        removeInfoFromSearch(collectionName, id).then(() => {

            setIsOpen(false);

        }).catch((e) => {

            console.error(e)

        })

    }


    function openUpdateModal(id) {
        setShowUpdate(true);
        setUpdateId(id);
    }

    return (
        <>
         {visible?(
               <main className="Destete_Search_containter">
               <section  className="Destete_info_container">
   
   
                   {generalSearchData.length > 0 ? (generalSearchData.map((list, index) =>
   
                       <div className="Destete_info_body" key={index}>
   
                           <header className="Destete_info_header">
                               <p className="Destete_info_header_title">Destete {index + 1}</p>
   
                               <div className="Destete_info_header_btn">
                                   <span className="Destete_info_header_btn" onClick={() => openUpdateModal(list.id)}>
                                    <FontAwesomeIcon icon={faPenToSquare} color={'#fff'} title={'Actualizar'} />
                               </span>
                               <span className="Destete_info_header_delete" onClick={()=>handleOpenRemove(list.id)}>
                                    <FontAwesomeIcon icon={faTrash} color={'#fff'} title={'Eliminar'} />
                               </span>  
                               </div>
   
                           </header>
   
   
                           <div className="Destete_info_text_container">
                               <p className="Destete_info_text"><span className="Destete_info_text2" >No. De La Madre:</span > {list.NoDeLaMadre}</p>
                               <p className="Destete_info_text"><span className="Destete_info_text2">NoDeLechones:</span > {list.NoDeLechones}</p>
                               <p className="Destete_info_text"><span className="Destete_info_text2" >Hembras:</span > {list.Hembras}</p>
                               <p className="Destete_info_text"><span className="Destete_info_text2" >Machos:</span > {list.Machos}</p>
                               <p className="Destete_info_text"><span className="Destete_info_text2" >FechaDeNacimiento:</span > {list.FechaDeNacimiento}</p>
                               <p className="Destete_info_text"><span className="Destete_info_text2" >Hierrro1ra:</span > {list.Hierrro1ra}</p>
                               <p className="Destete_info_text"><span className="Destete_info_text2" >Hierrro2da:</span > {list.Hierrro2da}</p>
                               <p className="Destete_info_text"><span className="Destete_info_text2" >SuplementosIniciar:</span > {list.SuplementosIniciar}</p>
                               <p className="Destete_info_text"><span className="Destete_info_text2" >ListosParaVenta:</span > {list.ListosParaVenta}</p>
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
   
             <DesteteUpdate 
               visible={showUpdate}  
               id={updateId} 
               showUpdate={showUpdate} 
               setShowUpdate={setShowUpdate} 
               generalData={generalSearchData} 
               setGeneralData={setGeneralSearchData} />

               

           </main>
         ):(<></>)}
        </>
      
    )
}