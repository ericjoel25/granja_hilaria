import { useState, useEffect } from "react";
import { useGetInfoFirebase } from "../../componets/hook/usegetInfoFirebase";
import { getAuth } from 'firebase/auth';
import firebase from "../../componets/firebase/firebase";
import {Modal, Loading, NoInformation} from "../../componets/modal";
import '../../componets/styles/engordarStyles/engordar.css';
import EngordarInputModal from './engordarInputModal';
import EngordarSearch from "./engordarSearch";
import EngordarUpdate from './engordarUpdate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faMagnifyingGlass, faCirclePlus, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';


const auth = getAuth(firebase);


export default function Engordar() {

    const collectionName = `Engorgar-${auth.currentUser.uid}`;
    
    const [search, setSearch] = useState('');
    const [openModalSearch, setOpenModalSearch]= useState();
    const [showSearch, setShowSearch] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showLoading, setShowLoading]= useState(true); 
    const [removeId, setRemoveId] = useState('');
    const [updateId, setUpdateId]= useState('');
    const [noInfo, setNoInfo] = useState(false);
    
   
    const [showForm, setShowForm] =useState(false);
    const [showDateleModal, setShowDaleteModal] = useState(false);

    const { getFirebaseInfo, removeInfoFromFirebase, removeInfoFromSearch,
         getMoreInfoFirebase, searchInfoFirebase, generalData, 
         setGeneralData, generalSearchData, setGeneralSearchData} = useGetInfoFirebase()



useEffect(() => {

    getFirebaseInfo(collectionName)
    .then(()=> setShowLoading(false))

}, [])


function handleUpdate(id){
    setUpdateId(id)
    setShowUpdate(true)
}

function handleRemove(id){
    setRemoveId(id); 
    setShowDaleteModal(true)
}


function handleSearch(){
    setShowSearch(true)

    function clearInput(){
      setSearch('')
    }
    
    function openSearchAlert(){
      setOpenModalSearch(true)
    }
    
    searchInfoFirebase(collectionName, "FechaDelDestete", search, clearInput, openSearchAlert)
}


function handleShow(){
    if(showSearch === true){
         setShowSearch(false); 
         return;
    }
 
    setShowForm(showForm => !showForm);
 }

    return (
        <div className="engordar_conatainer">
            <header className="E_header">
             
                <span className="E_header_btn" onClick={() => handleShow()}>
                  {showSearch === true ? <FontAwesomeIcon icon={faCircleArrowLeft} className="E_header_btn" title={'Regresar'} /> : <FontAwesomeIcon className="E_header_btn" title={'Agregar'} icon={faCirclePlus} />}
                  <p className="Icon_header_btn_Text">{showSearch ? 'Regresar' : 'Agregar'}</p>
                </span>

                <div>
                    <input className="E_header_buscar" type={'text'} placeholder='Buscar por fecha d/m/yy' onChange={(e) => setSearch(e.target.value)} value={search} />
                    <span className="E_header_buscar_btn" onClick={() => handleSearch()}>
                      <FontAwesomeIcon title={'Buscar'} icon={faMagnifyingGlass} size={'sm'} color={'#fff'} />
                    </span>
                </div>
                {generalData.length > 24 ? <button className="E_hearder_more" onClick={() => getMoreInfoFirebase(collectionName, () => setNoInfo(true))} >Cargar Más</button> : <></>}

            </header>

            <section  className="E_info_container">


                {generalData.length > 0 ? (generalData.map((list, index) => 
                <div className="E_info_body animate" key={index}>


                    <header className="E_info_header">
                        <p className="E_info_header_title">Engordar {index + 1}</p>

                        <div className="E_info_header_btn">
                            <span className="E_info_header_delete" onClick={() => handleUpdate(list.id)}>
                                 <FontAwesomeIcon icon={faPenToSquare} color={'#fff'} />
                            </span>
                            <span className="E_info_header_delete" onClick={()=>handleRemove(list.id)}>
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
                    <NoInformation show={setShowForm} setShow={showForm} />
                )}


            </section>

             <Modal
                visible={showDateleModal}
                title={'Esta seguro que quiere borror esta información?'}
                button1={'Descartar'}
                button2={'Borrar'}
                fnButton1={() => setShowDaleteModal(!showDateleModal)}
                fnButton2={() => removeInfoFromFirebase(collectionName, removeId).then(()=>{
                    setShowDaleteModal(false);
                 })}
            /> 


             <Modal
                visible={noInfo}
                title={'No hay más información que mostrar'}
                button1={'Aceptar'}
                fnButton1={() => setNoInfo(false)} />
              

         
            <Loading  visible={showLoading} />
         
            <EngordarUpdate  
                visible={showUpdate} 
                id={updateId} 
                showUpdate={showUpdate} 
                setShowUpdate={setShowUpdate} 
                generalData={generalData} 
                setGeneralData={setGeneralData}  />
           

         
            <EngordarSearch 
                visible={showSearch} 
                generalSearchData={generalSearchData} 
                setGeneralSearchData={setGeneralSearchData} 
                removeInfoFromSearch={removeInfoFromSearch}  />
           

            <EngordarInputModal 
                visible={showForm} 
                setGeneralData={setGeneralData} 
                generalData={generalData} 
                setShowForm={setShowForm}   />
           
          
        </div>
    )
}