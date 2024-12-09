import { useState, useEffect, useRef } from "react";
import GestationSetInfoModal from './GestationSetInfoModal';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import {Modal, Loading, NoInformation} from '../../componets/modal'; 
import GestationSearchInfo from './GestationSearchInfo';
import UpdateGestation from './updateGestation';
import { useGetInfoFirebase } from "../../componets/hook/usegetInfoFirebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faTable, faSquare, faMagnifyingGlass, faCirclePlus, faCircleArrowLeft, faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import {gestacionCSS} from '../../styles'; 

const auth = getAuth(firebase);


export default function Gestation() {

  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showLoading, setShowLoading] = useState(true)
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateId, setUpdateId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [close, setClose] = useState(false)
  const [noInfo, setNoInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [removeId, setRemoveId] = useState('');
  const collectionName = `Getation-${auth.currentUser.uid}`;
  const scrollView = useRef();
  const [openModalSearch, setOpenModalSearch] = useState(false)
  const [tableLimit, setTableLimit] = useState(8)
  const { getFirebaseInfo, removeInfoFromFirebase, removeInfoFromSearch,
    getMoreInfoFirebase, searchInfoFirebase, generalSearchData, setGeneralSearchData } = useGetInfoFirebase(); 

  const [generalData, setGeneralData] = useState([]); 


  useEffect(() => {

    getFirebaseInfo(collectionName).then((data) =>{
      setGeneralData(data)
      setShowLoading(false)
      console.log('inicio')
    } );


  }, [])



  /** handle remove information */
  function handleRemove(id) {
    console.log({removeId: id })
    setRemoveId(id);
    setOpenModal(true)
  }

  /** / handle remove information */



const handelOpenAddModal = () => {

  if (showSearch === true) {
      setShowSearch(false);
      return;
    }
    

   if(show){
     setClose(true); 

     setTimeout(()=>{
       
       setShow(false);
       setClose(false); 

     },500)

     return
   }  

   setShow(show => !show);


  }

  /** This seccion handle the search function  */




  function handleSearch() {
    setShowSearch(true)

    function clearInput() {
      setSearch('')
    }

    function openSearchAlert() {
      setOpenModalSearch(true)
    }

    searchInfoFirebase(collectionName, "NoDelCerdo", search, clearInput, openSearchAlert)
  }


  /** / This seccion handle the search function  */


  function handleOpenUpdate(id) {
    setUpdateId(id);
    setShowUpdate(true);
  }

  function DataForTable() {
    let data = generalData.slice(tableLimit - 8, tableLimit)

    return data
  }


  function DataTableNext() {
    if (generalData.length - tableLimit <= 0) {
        
       getMoreInfoFirebase({collectionName, alertNoInfo:() => setNoInfo(true)})
       .then((data)=> setGeneralData([...generalData, ...data]) )

      console.log(tableLimit) 
      return;
    }
   
   
    setTableLimit(tableLimit + 8);
  }

  function DataTableBack() {
    if (tableLimit === 8) {
      return;
    }

    setTableLimit(tableLimit - 8);
  }

  return (
    <div className={gestacionCSS.conatainer}>

      <header className={gestacionCSS.G_header}>

        <span className={gestacionCSS.G_header_btn} onClick={() => handelOpenAddModal()}>
          {showSearch === true ? <FontAwesomeIcon icon={faCircleArrowLeft} className={gestacionCSS.G_header_btn} title={'Regresar'} /> : <FontAwesomeIcon className={gestacionCSS.G_header_btn} title={'Agregar'} icon={faCirclePlus} />}
          {/* <p className={gestacionCSS.Icon_header_btn_Text} >{showSearch ? 'Regresar' : 'Agregar'}</p>*/}
        </span>

        <div>
          <input className={gestacionCSS.G_header_buscar} type={'text'} placeholder='Buscar' onChange={(e) => setSearch(e.target.value)} value={search} />
          <span className={gestacionCSS.G_header_buscar_btn} onClick={() => handleSearch()}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size={'sm'} color={'#fff'} />
          </span>
        </div>
        {generalData.length > 24 ? <button className={gestacionCSS.G_hearder_more} onClick={() => {
          getMoreInfoFirebase({collectionName, alertNoInfo:() => setNoInfo(true)})
          .then((data)=> setGeneralData([...generalData, ...data]) )
        }}>Cargar Más</button> : <></>}


      </header>

      {generalData.length ? (
        <section ref={scrollView} className={`${gestacionCSS.G_table_container} ${gestacionCSS.animate}`}>

          <div className={gestacionCSS.gestation_table_body}>

            <table className={gestacionCSS.gestation_table}>


              <thead className={gestacionCSS.gestation_table_header}>
                <tr>
                  <th>No Del Cerdo</th>
                  <th>Edad</th>
                  <th>No Cerda</th>
                  <th>No Parto</th>
                  <th>Inicio De Gestación</th>
                  <th>Fin De Gestación</th>
                  <th>No De Lechones</th>
                  <th>Vivos</th>
                  <th>Muertos</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>

              {generalData.length > 0 ? DataForTable().map((list, index) =>
                <tbody key={index}>
                  <tr>
                    <td className={gestacionCSS.table_td}>{list.NoDelCerdo}</td>
                    <td>{list.Edad}</td>
                    <td>{list.NoCerda}</td>
                    <td>{list.NoParto}</td>
                    <td>{list.InicioDeGestación}</td>
                    <td>{list.FinDeGestación}</td>
                    <td>{list.NoDeLechones}</td>
                    <td>{list.Vivos}</td>
                    <td>{list.Muertos}</td>
                    <td>
                      <span onClick={() => handleOpenUpdate(list.id)}>
                        <FontAwesomeIcon icon={faPenToSquare} size={'xl'} color={'#000'} />
                      </span>
                    </td>

                    <td>
                      <button className={gestacionCSS.G_info_header_delete} onClick={() => handleRemove(list.id)}>
                        <FontAwesomeIcon icon={faTrash} color={'#000'} />
                      </button>

                    </td>

                  </tr>
                </tbody>
              ) : <></>}
            </table>

            <footer className={gestacionCSS.table_footer}>
              <span className={gestacionCSS.table_footer_btn} onClick={() => DataTableBack()}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </span>
              <p>{generalData.length - tableLimit < 0 ? generalData.length : tableLimit}-{generalData.length}</p>
              <span className={gestacionCSS.table_footer_btn} onClick={() => DataTableNext()}>
                <FontAwesomeIcon icon={faAnglesRight} />
              </span>
            </footer>
          </div>


        </section>
      ) : (
            <NoInformation setShow={setShow} show={show}/>
        )}


      
 


      <Modal
        visible={openModal}
        title={'Esta seguro que deseas eliminar esta información?'}
        bodyColor={'#39645C'}
        textColor={'#fff'}
        buttonColor={'#1E3D37'}
        button1={'No'}
        button2={'Si'}
        fnButton1={() => setOpenModal(false)}
        fnButton2={() => removeInfoFromFirebase({collectionName, data:generalData, id:removeId}).then((data) => {
          setGeneralData(data); 
          setOpenModal(false);
          
        })}
      />

      <Modal
        visible={noInfo}
        title={'No hay más información que mostrar'}
        button1={'Aceptar'}
        fnButton1={() => setNoInfo(false)}
      />

      <Loading visible={showLoading} />

    
     <GestationSetInfoModal 
         visible={show} 
         show={show}
         setShow={setShow}
         setGeneralData={setGeneralData} 
         generalData={generalData}
         close={close}
         setClose={setClose}
       
       /> 

     <UpdateGestation 
       visible={showUpdate} 
       showUpdate={showUpdate} 
       setShowUpdate={setShowUpdate} 
       id={updateId} 
       setGeneralData={setGeneralData} 
       generalData={generalData} 
       
       />

      <GestationSearchInfo 
        visible={showSearch} 
        collectionName={collectionName} 
        generalSearchData={generalSearchData}    
        setGeneralSearchData={setGeneralSearchData}
        openModalSearch={openModalSearch} 
        setOpenModalSearch={setOpenModalSearch} 
        removeInfoFromSearch={removeInfoFromSearch} 
        
      /> 


    </div>
  )
}

