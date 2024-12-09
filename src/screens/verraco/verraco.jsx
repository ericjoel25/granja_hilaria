import {useState, useEffect, useRef} from "react";
import '../../componets/styles/gestationStyle.css';
import '../../componets/styles/varracoStyles/varracoStyle.css';
import VerracoModalSetInfo from '../verraco/VerracoModalSetInfo';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import {Modal, Loading, NoInformation} from "../../componets/modal";
import UpdateVerraco from "./verracoUpdate";
import VerracoSearch from "./VerracoSearch";
import { useGetInfoFirebase } from "../../componets/hook/usegetInfoFirebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faMagnifyingGlass, faCirclePlus, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';


const auth = getAuth(firebase);


export default function Verraco(){


    const collectionName = `Verraco-${auth.currentUser.uid}`;

    const [search, setSearch] = useState('');
    const [openModalSearch, setOpenModalSearch]= useState();
    const [showSearch, setShowSearch] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showLoading, setShowLoading]= useState(true);
    const [removeId, setRemoveId] = useState('');
    const [updateId, setUpdateId]= useState('');
    const [noInfo, setNoInfo] = useState(false);
    
    const scrollView = useRef();
    const [show, setShow] =useState(false);
    const [showDateleModal, setShowDaleteModal] = useState(false);

    const { getFirebaseInfo, removeInfoFromFirebase, removeInfoFromSearch,
         getMoreInfoFirebase, searchInfoFirebase, generalData, 
         setGeneralData, generalSearchData, setGeneralSearchData} = useGetInfoFirebase()
    

 useEffect(()=>{

   getFirebaseInfo(collectionName)
   .then(()=> setShowLoading(false))
   
 },[])


 
 /** Remove information  */ 
 
function handleRemove(id){
    setRemoveId(id); 
    setShowDaleteModal(true)
}

/** / Remove Information */



/** Update Informatio */

function handleUpdate(id){
    setUpdateId(id)
    setShowUpdate(true)
}

/** / Update information */



function handleShow(){
   if(showSearch === true){
        setShowSearch(false); 
        
        return
   }

   setShow(show => !show)
}

/** Search information */


function handleSearch(){
    setShowSearch(true)

    function clearInput(){
      setSearch('')
    }
    
    function openSearchAlert(){
      setOpenModalSearch(true)
    }
    
    searchInfoFirebase(collectionName, "NoDelCerdo", search, clearInput, openSearchAlert)
}

/** Search Function **/


  return (
        <div className="varraco_conatainer">
            <header className="V_header">
        
                <span className="V_header_btn" onClick={() => handleShow()}>
                  {showSearch === true ? <FontAwesomeIcon icon={faCircleArrowLeft} className="V_header_btn" title={'Regresar'} /> : <FontAwesomeIcon className="V_header_btn" title={'Agregar'} icon={faCirclePlus} />}
                  <p className="Icon_header_btn_Text">{showSearch ? 'Regresar' : 'Agregar'}</p>
                </span>
                
                <div>
                  <input className="V_header_buscar"  type={'text'} placeholder='Buscar' onChange={(e)=> setSearch(e.target.value)}  value={search} />
                  <span className="V_header_buscar_btn" onClick={() => handleSearch()}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} size={'sm'} color={'#fff'} />
                  </span>
                </div>

                {generalData.length >24? <button className="V_hearder_more" onClick={()=> getMoreInfoFirebase(collectionName, ()=>setNoInfo(true))} >Cargar Más</button>:<></>}
                
            </header>
            
           <section ref={scrollView} className="V_info_container">

           
                {generalData.length > 0 ? (generalData.map((list, index) =>
                 <div className="V_info_body animate" key={index}>
                    

                    <header className="V_info_header">
                        <p className="V_info_header_title">Verraco {index+1}</p>
                        
                        <div className="V_info_header_btn">
                          <span className="V_info_header_delete" onClick={() => handleUpdate(list.id)}>
                             <FontAwesomeIcon icon={faPenToSquare} color={'#fff'} />
                          </span>
                          <span className="V_info_header_delete" onClick={()=>handleRemove(list.id)}>
                             <FontAwesomeIcon icon={faTrash} color={'#fff'} />
                          </span>  
                        </div>
                       
                    </header>  

                    <div>
                        <p className="V_info_text"><span className="G_info_text2" >Fecha:</span > {list.Fecha}</p>
                        <p className="V_info_text"><span  className="G_info_text2">No del cerdo:</span > {list.NoDelCerdo}</p>
                        <p className="V_info_text"><span  className="G_info_text2" >Edad:</span > {list.Edad}</p>
                        <p className="V_info_text"><span  className="G_info_text2" >No de la cerda que gestó:</span > {list.NoDeLaCerdaGestó}</p>

                    </div>
                
                </div>
                )) : (
                    <NoInformation show={show} setShow={setShow} />
                )}
      
          
      </section>
       
          <Modal
            visible={showDateleModal}
            title={'Esta seguro que quiere borror esta información?'} 
            button1={'Descartar'}
            button2={'Borrar'}
            fnButton1={()=> setShowDaleteModal(!showDateleModal)}
            fnButton2={()=> removeInfoFromFirebase(collectionName, removeId).then(()=>{
                  setShowDaleteModal(false);
               })}
             />


            <Modal 
               visible={noInfo}
               title={'No hay más información que mostrar'}
               button1={'Aceptar'}
               fnButton1={()=>setNoInfo(false)}
             
              />
            < Loading  visible={showLoading}/>
        
        <VerracoSearch 
          visible={showSearch} 
          generalSearchData={generalSearchData} 
          setGeneralSearchData={setGeneralSearchData} 
          openModalSearch={openModalSearch}  
          removeInfoFromSearch={removeInfoFromSearch}  
        />

         <UpdateVerraco 
           visible={showUpdate}  
           id={updateId} 
           showUpdate={showUpdate} 
           setShowUpdate={setShowUpdate} 
           generalData={generalData} 
           setGeneralData={setGeneralData} 
           getFirebaseInfo={ getFirebaseInfo} 
           
          />
          
         <VerracoModalSetInfo 
            visible={show} 
            show={show} 
            setShow={setShow} 
            setGeneralData={setGeneralData} 
            generalData={generalData} 
            
            />

        </div>
    )
}