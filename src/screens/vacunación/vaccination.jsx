import {useState, useEffect, useRef} from "react";
import '../../componets/styles/vaccinationStyles/vaccination.css';
import ActualizarIcon from '../../componets/imagenes/actualizar.png';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import {Loading, Modal, NoInformation} from "../../componets/modal";
import { useGetInfoFirebase } from "../../componets/hook/usegetInfoFirebase";
import VaccinationModalSetInfo from "./vaccinationModalSetInfo";
import VaccinationUpdate from "./vaccinationUpdate";
import VaccinationSearch from "./vaccinationSeach";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faMagnifyingGlass, faCirclePlus, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';



const auth = getAuth(firebase);


export default function Vaccination(){


    const collectionName = `Vacunación-${auth.currentUser.uid}`;

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
    
    searchInfoFirebase(collectionName, "Fecha", search, clearInput, openSearchAlert)
}

/** Search Function **/


  return (
        <div className="vaccination_conatainer">
              <header className="vaccination_header">
               
                <span className="vaccination_header_btn" onClick={() => handleShow()}>
                  {showSearch === true ? <FontAwesomeIcon icon={faCircleArrowLeft} className="vaccination_header_btn" title={'Regresar'} /> : <FontAwesomeIcon className="vaccination_header_btn" title={'Agregar'} icon={faCirclePlus} />}
                  <p className="Icon_header_btn_Text">{showSearch ? 'Regresar' : 'Agregar'}</p>
                </span>

                <section>
                    <input className="vaccination_header_buscar"  type={'text'} placeholder='Buscar' onChange={(e)=> setSearch(e.target.value)}  value={search} />
                
                    <span className="vaccination_header_buscar_btn" onClick={() => handleSearch()}>
                      <FontAwesomeIcon title={'Buscar'} icon={faMagnifyingGlass} size={'sm'} color={'#fff'} />
                    </span>
                </section>
                {generalData.length >24? <button className="vaccination_hearder_more" onClick={()=> getMoreInfoFirebase(collectionName, ()=>setNoInfo(true))} >Cargar Más</button>:<></>}
                
            </header>
            
           <section ref={scrollView} className="vaccination_info_container">

           
                {generalData.length > 0 ? (generalData.map((list, index) =>
                
                <div className="vaccination_info_body animate" key={index}>
                    
                      <header className="vaccination_info_header">
                        <p className="vaccination_info_header_title">Vacunación {index+1}</p>
                        
                        <div className="vaccination_info_header_btn">
                        
                          <span className="vaccination_info_header_delete" onClick={() => handleUpdate(list.id)}>
                                 <FontAwesomeIcon icon={faPenToSquare} color={'#fff'} />
                            </span>
                            <span className="vaccination_info_header_delete" onClick={()=>handleRemove(list.id)}>
                                 <FontAwesomeIcon icon={faTrash} color={'#fff'} />
                            </span>   
                        </div>
                       
                    </header>  
         

                   
                    <div className="vaccination_info_text_container">
                        <p className="vaccination_info_text"><span className="vaccination_info_text2" >Fecha:</span > {list.Fecha}</p>
                        <p className="vaccination_info_text"><span  className="vaccination_info_text2">Tipo De Vacuna:</span > {list.TipoDeVacuna}</p>
                        <p className="vaccination_info_text"><span  className="vaccination_info_text2" >Fecha2do:</span > {list.Fecha2do}</p>
                        <p className="vaccination_info_text"><span  className="vaccination_info_text2" >No De Cerda:</span > {list.NoDeCerda}</p>
                        <p className="vaccination_info_text"><span  className="vaccination_info_text2" >Tipo De Vitamina:</span > {list.TipoDeVitamina}</p>
                    
                    </div>
                
                </div>
                )) : (
                    <NoInformation  show={show} setShow={setShow} />
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
            <Loading  visible={showLoading} />
        
       <VaccinationSearch visible={showSearch} generalSearchData={generalSearchData} setGeneralSearchData={setGeneralSearchData} 
          openModalSearch={openModalSearch}  removeInfoFromSearch={removeInfoFromSearch} />

         <VaccinationUpdate 
            visible={showUpdate}  
            id={updateId} 
            showUpdate={showUpdate} 
            setShowUpdate={setShowUpdate} 
            generalData={generalData} 
            setGeneralData={setGeneralData} />
          
          <VaccinationModalSetInfo 
            visible={show} 
            show={show} 
            setShow={setShow} 
            setGeneralData={setGeneralData} 
            generalData={generalData} 
          />
        
        </div>
    )
}