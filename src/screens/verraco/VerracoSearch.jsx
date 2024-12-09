
import '../../componets/styles/varracoStyles/V_Search.css';
import '../../componets/styles/varracoStyles/verracoModalInfo.css'; 
import {Modal} from '../../componets/modal';
import { useState } from 'react';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import UpdateVerraco from './verracoUpdate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const auth = getAuth(firebase);

/**
 *  Create => const [show, setShow]=useState(false).
 * Then provided  visible={show} as props.
 **/

export default function VerracoSearch(props) {
    
    const collectionName = `Verraco-${auth.currentUser.uid}`;
    const {visible, generalSearchData, setGeneralSearchData, removeInfoFromSearch  } = props;
    const [isOpen, setIsOpen]= useState(false); 
    const [showUpdate, setShowUpdate] = useState(false); 
    const [updateId, setUpdateId] = useState('')
    const [removeItem, setRemoveItem]=useState({
        id:'',
        item:''
    }); 
    

  
   
function handleOpen(id, item){
    setIsOpen(true); 
    setRemoveItem({id, item}); 

}



const remove = async (id) => {

    removeInfoFromSearch(collectionName, id).then(()=>{
 
        setIsOpen(false);
      
    }).catch((e)=>{
 
      console.error(e)
 
    })
 
}


function openUpdateModal(id){
   setShowUpdate(true);
   setUpdateId(id);
}

    return (

        <>
          {visible?(
                    <main className="V_S_containter">
                    <section className="V_info_container">
        
        
                        {generalSearchData.length > 0 ? (generalSearchData.map((list, index) => <div className="V_info_body" key={index}>
        
        
                            <header className="V_info_header">
                                <p className="V_info_header_title">Verraco {index + 1}</p>
                            
                                <span className="V_info_header_delete" onClick={() => openUpdateModal(list.id)}>
                                     <FontAwesomeIcon icon={faPenToSquare} color={'#fff'} />
                                  </span>
                                  <span className="V_info_header_delete" onClick={()=>handleOpen(list.id)}>
                                     <FontAwesomeIcon icon={faTrash} color={'#fff'} />
                                  </span>  
                            </header>
        
                            <div>
                                <p className="V_info_text"><span className="G_info_text2" >Fecha:</span > {list.Fecha}</p>
                                <p className="V_info_text"><span className="G_info_text2">No del cerdo:</span > {list.NoDelCerdo}</p>
                                <p className="V_info_text"><span className="G_info_text2" >Edad:</span > {list.Edad}</p>
                                <p className="V_info_text"><span className="G_info_text2" >No de la cerda que gestó:</span > {list.NoDeLaCerdaGestó}</p>
        
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
                   fnButton1={()=> setIsOpen(false)}
                   fnButton2={()=> remove(removeItem.id)}
                 />
        
        
              <UpdateVerraco visible={showUpdate}  id={updateId} showUpdate={showUpdate} 
                   setShowUpdate={setShowUpdate} generalData={generalSearchData} setGeneralData={setGeneralSearchData} /> 
                </main>
          ):(<></>)}
        </>
  
    )
}