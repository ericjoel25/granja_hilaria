
import '../../componets/styles/vaccinationStyles/vaccination.css';
import {Modal} from '../../componets/modal';
import { useState } from 'react';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare  } from '@fortawesome/free-solid-svg-icons';
import VaccinationUpdate from './vaccinationUpdate';



const auth = getAuth(firebase);



/**
 * @param {visible} props  provide the props visible={boalean}
 * @returns Open the modal with the form to set the information.
 */

export default function VaccinationSearch(props) {

    const collectionName = `Vacunación-${auth.currentUser.uid}`;
    const {visible, generalSearchData, setGeneralSearchData, removeInfoFromSearch } = props;
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
             <section className="vaccination_info_container">
 
 
                 {generalSearchData.length > 0 ? (generalSearchData.map((list, index) =>
 
                     <div className="vaccination_info_body" key={index}>
 
                         <header className="vaccination_info_header">
                             <p className="vaccination_info_header_title">Vacunación {index + 1}</p>
 
                             <div className="vaccination_info_header_btn">
 
                                 <span className="vaccination_info_header_delete" onClick={() => openUpdateModal(list.id)}>
                                  <FontAwesomeIcon icon={faPenToSquare} color={'#fff'} />
                             </span>
                             <span className="vaccination_info_header_delete" onClick={()=>handleOpenRemove(list.id)}>
                                  <FontAwesomeIcon icon={faTrash} color={'#fff'} />
                             </span>  
                             </div>
 
                         </header>
 
 
 
                         <div className="vaccination_info_text_container">
                             <p className="vaccination_info_text"><span className="vaccination_info_text2" >Fecha:</span > {list.Fecha}</p>
                             <p className="vaccination_info_text"><span className="vaccination_info_text2">Tipo De Vacuna:</span > {list.TipoDeVacuna}</p>
                             <p className="vaccination_info_text"><span className="vaccination_info_text2" >Fecha2do:</span > {list.Fecha2do}</p>
                             <p className="vaccination_info_text"><span className="vaccination_info_text2" >No De Cerda:</span > {list.NoDeCerda}</p>
                             <p className="vaccination_info_text"><span className="vaccination_info_text2" >Tipo De Vitamina:</span > {list.TipoDeVitamina}</p>
 
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
 
 
          <VaccinationUpdate visible={showUpdate}  id={updateId} showUpdate={showUpdate} 
            setShowUpdate={setShowUpdate} generalData={generalSearchData} setGeneralData={setGeneralSearchData} />
         </main>
        ):(<></>)}
       </>
    )
}