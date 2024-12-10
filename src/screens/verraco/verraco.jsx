import { useState, useEffect, useRef } from "react";
import VerracoModalSetInfo from '../verraco/VerracoModalSetInfo';
import firebase from "../../componets/firebase/firebase";
import { getAuth } from 'firebase/auth';
import { Modal, Loading, NoInformation } from "../../componets/modal";
import UpdateVerraco from "./verracoUpdate";
import VerracoSearch from "./VerracoSearch";
import { useGetInfoFirebase } from "../../componets/hook/usegetInfoFirebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faMagnifyingGlass, faCirclePlus, faCircleArrowLeft, faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { verracoStyle as styles } from '../../styles';



const auth = getAuth(firebase);


export default function Verraco() {


  const collectionName = `Verraco-${auth.currentUser.uid}`;

  const [search, setSearch] = useState('');
  const [openModalSearch, setOpenModalSearch] = useState();
  const [showSearch, setShowSearch] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [removeId, setRemoveId] = useState('');
  const [updateId, setUpdateId] = useState('');
  const [noInfo, setNoInfo] = useState(false);

  const scrollView = useRef();
  const [show, setShow] = useState(false);
  const [showDateleModal, setShowDaleteModal] = useState(false);
  const [tableLimit, setTableLimit] = useState(8)
  const { getFirebaseInfo, removeInfoFromFirebase, removeInfoFromSearch,
    getMoreInfoFirebase, searchInfoFirebase, generalData,
    setGeneralData, generalSearchData, setGeneralSearchData } = useGetInfoFirebase()


  useEffect(() => {

    getFirebaseInfo(collectionName)
      .then(() => setShowLoading(false))

  }, [])



  /** Remove information  */

  function handleRemove(id) {
    setRemoveId(id);
    setShowDaleteModal(true)
  }

  /** / Remove Information */



  /** Update Informatio */

  function handleUpdate(id) {
    setUpdateId(id)
    setShowUpdate(true)
  }

  /** / Update information */



  function handleShow() {
    if (showSearch === true) {
      setShowSearch(false);

      return
    }

    setShow(show => !show)
  }

  /** Search information */


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

  /** Search Function **/

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
    <div className={styles.varraco_conatainer}>
      <header className={styles.V_header}>

        <span className={styles.V_header_btn} onClick={() => handleShow()}>
          {showSearch === true ? <FontAwesomeIcon icon={faCircleArrowLeft} className={styles.V_header_btn} title={'Regresar'} /> : <FontAwesomeIcon className="V_header_btn" title={'Agregar'} icon={faCirclePlus} />}

        </span>

        <div>
          <input className={styles.V_header_buscar} type={'text'} placeholder='Buscar' onChange={(e) => setSearch(e.target.value)} value={search} />
          <span className={styles.V_header_buscar_btn} onClick={() => handleSearch()}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size={'sm'} color={'#fff'} />
          </span>
        </div>

        {generalData.length > 24 ? <button className={styles.V_hearder_more} onClick={() => getMoreInfoFirebase(collectionName, () => setNoInfo(true))} >Cargar Más</button> : <></>}

      </header>

      <section ref={scrollView} className={styles.V_info_container}>
        <table className={styles.table}>

          <thead className={styles.tableHeader}>
            <tr className={styles.table_header_tr}>
              <th>No Del Cerdo</th>
              <th>Fecha</th>
              <th>Edad</th>
              <th>No De La Cerda Gestó</th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          {generalData.length > 0 ? DataForTable().map((list, index) =>
            <tbody key={index}>
              <tr>
                <td >{list.NoDelCerdo}</td>
                <td> {list.Fecha}</td>
                <td>{list.Edad}</td>
                <td>{list.NoDeLaCerdaGestó}</td>
                <td>
                  <span className={styles.table_btn} onClick={()=> handleUpdate(list.id)}>
                    <FontAwesomeIcon icon={faPenToSquare} size={'xl'} color={'#000'} />
                  </span>
                </td>

                <td>
                  <button  className={styles.table_btn2} onClick={()=> handleRemove(list.id)} >
                    <FontAwesomeIcon icon={faTrash} color={'#000'} />
                  </button>

                </td>

              </tr>
            </tbody>
          ) : <></>}
        </table>
        <div className={styles.footer}>
          <span className={styles.footer_btn} onClick={() => DataTableBack()}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </span>
          <p>{generalData.length - tableLimit < 0 ? generalData.length : tableLimit}-{generalData.length}</p>
          <span className={styles.footer_btn} onClick={() => DataTableNext()}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </span>
        </div>
      </section>

      <Modal
        visible={showDateleModal}
        title={'Esta seguro que quiere borror esta información?'}
        button1={'Descartar'}
        button2={'Borrar'}
        fnButton1={() => setShowDaleteModal(!showDateleModal)}
        fnButton2={() => removeInfoFromFirebase({collectionName, data:generalData, id:removeId}).then((data) => {
          setShowDaleteModal(false);
          setGeneralData(data); 
        })}
      />


      <Modal
        visible={noInfo}
        title={'No hay más información que mostrar'}
        button1={'Aceptar'}
        fnButton1={() => setNoInfo(false)}

      />
      < Loading visible={showLoading} />

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
        getFirebaseInfo={getFirebaseInfo}

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