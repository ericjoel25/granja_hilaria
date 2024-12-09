import {useState, useEffect, useRef} from "react";
import '../../componets/styles/desteteStyles/destete.css';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import {Modal, NoInformation, Loading} from "../../componets/modal";
import { useGetInfoFirebase } from "../../componets/hook/usegetInfoFirebase";
import DesteteModalSetInfo from "./desteteModaleSetInfo";
import DesteteUpdate from "./desteteUpdate";
import DesteteSearch from "./desteteSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faMagnifyingGlass, faCirclePlus, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';


const auth = getAuth(firebase);


export default function Destete(){


    const collectionName = `Destete-${auth.currentUser.uid}`;

    const [search, setSearch] = useState('');
    const [openModalSearch, setOpenModalSearch]= useState();
    const [showSearch, setShowSearch] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    const [removeId, setRemoveId] = useState('');
    const [updateId, setUpdateId]= useState('');
    const [noInfo, setNoInfo] = useState(false);
    const [showLoading, setShowLoading]= useState(true);
    const scrollView = useRef();
    const [show, setShow] =useState(false);
    const [showDateleModal, setShowDaleteModal] = useState(false);

    const { getFirebaseInfo, removeInfoFromFirebase, removeInfoFromSearch,
         getMoreInfoFirebase, searchInfoFirebase, generalData, 
         setGeneralData, generalSearchData, setGeneralSearchData} = useGetInfoFirebase()
    

 useEffect(()=>{

   getFirebaseInfo(collectionName)
   .then(()=>setShowLoading(false))
  
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
    
    searchInfoFirebase(collectionName, "NoDeLaMadre", search, clearInput, openSearchAlert)
}

/** Search Function **/


  return (
        <div className="destete_conatainer">
              <header className="Destete_header">
        
                <span className="Destete_header_btn" onClick={() => handleShow()}>
                  {showSearch === true ? <FontAwesomeIcon icon={faCircleArrowLeft} className="Destete_header_btn" title={'Regresar'} /> : <FontAwesomeIcon className="Destete_header_btn" title={'Agregar'} icon={faCirclePlus} />}
                  <p className="Icon_header_btn_Text">{showSearch ? 'Regresar' : 'Agregar'}</p>
                </span>

                <section>
                    <input className="Destete_header_buscar"  type={'text'} placeholder='Buscar' onChange={(e)=> setSearch(e.target.value)}  value={search} />
              
                    <span className="Destete_header_buscar_btn" onClick={() => handleSearch()}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} size={'sm'} color={'#fff'} />
                    </span>
                </section>
                {generalData.length >24? <button className="Destete_hearder_more" onClick={()=> getMoreInfoFirebase(collectionName, ()=>setNoInfo(true))} >Cargar Más</button>:<></>}
                
            </header>
            
           <section ref={scrollView} className="Destete_info_container">

           
                {generalData.length > 0 ? (generalData.map((list, index) =>
                
                <div className="Destete_info_body animate" key={index}>
                    
                      <header className="Destete_info_header">
                        <p className="Destete_info_header_title">Destete {index+1}</p>
                        
                        <div className="Destete_info_header_btn">
                          <span className="Destete_info_header_btn" onClick={() => handleUpdate(list.id)}>
                                 <FontAwesomeIcon icon={faPenToSquare} color={'#fff'} title={'Actualizar'} />
                            </span>
                            <span className="Destete_info_header_delete" onClick={()=>handleRemove(list.id)}>
                                 <FontAwesomeIcon icon={faTrash} color={'#fff'} title={'Eliminar'} />
                            </span>  
                        </div>                      
                    </header>  

                   
                    <div className="Destete_info_text_container">
                        <p className="Destete_info_text"><span className="Destete_info_text2" >No. De La Madre:</span > {list.NoDeLaMadre}</p>
                        <p className="Destete_info_text"><span  className="Destete_info_text2">NoDeLechones:</span > {list.NoDeLechones}</p>
                        <p className="Destete_info_text"><span  className="Destete_info_text2" >Hembras:</span > {list.Hembras}</p>
                        <p className="Destete_info_text"><span  className="Destete_info_text2" >Machos:</span > {list.Machos}</p>
                        <p className="Destete_info_text"><span  className="Destete_info_text2" >FechaDeNacimiento:</span > {list.FechaDeNacimiento}</p>
                        <p className="Destete_info_text"><span  className="Destete_info_text2" >Hierrro1ra:</span > {list.Hierrro1ra}</p>
                        <p className="Destete_info_text"><span  className="Destete_info_text2" >Hierrro2da:</span > {list.Hierrro2da}</p>
                        <p className="Destete_info_text"><span  className="Destete_info_text2" >SuplementosIniciar:</span > {list.SuplementosIniciar}</p>
                        <p className="Destete_info_text"><span  className="Destete_info_text2" >ListosParaVenta:</span > {list.ListosParaVenta}</p>
                    </div>
                
                </div>
                )) : (
                    < NoInformation show={show} setShow={setShow} />
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

             <Loading   visible={showLoading}/>
        
         <DesteteSearch 
            visible={showSearch} 
            generalSearchData={generalSearchData} 
            setGeneralSearchData={setGeneralSearchData} 
            openModalSearch={openModalSearch}  
            removeInfoFromSearch={removeInfoFromSearch} 
          />

         <DesteteUpdate  
            visible={showUpdate} 
            id={updateId} 
            showUpdate={showUpdate} 
            setShowUpdate={setShowUpdate} 
            generalData={generalData} 
            setGeneralData={setGeneralData} 
         />   
          
          <DesteteModalSetInfo 
              visible={show} 
              show={show} 
              setShow={setShow} 
              setGeneralData={setGeneralData} 
              generalData={generalData} 
           />


        </div>
    )
}