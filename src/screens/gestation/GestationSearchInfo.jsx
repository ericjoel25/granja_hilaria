import { useState } from 'react';
import {Modal} from '../../componets/modal'; 
import UpdateGestation from './updateGestation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare, faCircleInfo, faChartPie } from '@fortawesome/free-solid-svg-icons'
import {gestationSearchStyle as styles} from '../../styles'; 

/**
 * 
 * We need to provided a stete boolean to handle the visible
 */

export default function GestationSearchInfo(props) {
  

  const {visible, collectionName,openModalSearch, setOpenModalSearch, generalSearchData, setGeneralSearchData, removeInfoFromSearch  } = props;
  const [showDetails, setShowDetails] = useState(false)
  const [isOpen, setIsOpen]= useState(false); 
  const [updateId, setUpdateId] = useState('')
  const [showUpdate, setShowUpdate] = useState(false); 
  const [removeItem, setRemoveItem]=useState({ id:'', item:''});




  const totalData = generalSearchData.reduce((prev, next)=>{
    prev.NoDelCerdo = next.NoDelCerdo;
    prev.NoParto = next.NoDelCerdo;
    prev.NoDeLechones += parseFloat(next.NoDeLechones);
    prev.Muertos += parseFloat(next.Muertos);
    prev.Vivos += parseFloat(next.Vivos);

    return prev; 
  },{NoDelCerdo: "", NoParto:"", Muertos: 0, NoDeLechones: 0, Vivos: 0})


  const percentMuertos = ((22 / 100) * ((totalData.Muertos / totalData.NoDeLechones) * 100));
  const  percentVivo = ((22 / 100) * ((totalData.Vivos / totalData.NoDeLechones) * 100));
  const Muertos =percentMuertos.toString() ==='NaN'? 0: percentMuertos.toFixed(1);
  const Vivos =percentVivo.toString() ==='NaN'? 0: percentVivo.toFixed(1);

  const showMunero = ((totalData.Muertos / totalData.NoDeLechones) * 100).toFixed(1)
  const showVivo = ((totalData.Vivos / totalData.NoDeLechones) * 100).toFixed(1)
  const textMuerto = showMunero ==='NaN'?0: showMunero; 
  const textVivos = showVivo ==='NaN'?0: showVivo; 
  


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
     {visible? (
        <div className={styles.gestation_Search_conatainer}>
        <section className={styles.gestation_Search_header}>
          <span  onClick={()=> setShowDetails(!showDetails)}>
             {showDetails?<FontAwesomeIcon title={'Grafica'} className={styles.G_search_header_btn}  icon={faChartPie} /> :<FontAwesomeIcon title={'Detalles'} className={styles.G_search_header_btn} icon={faCircleInfo} />
               
             }
            
          
           </span>
   
       
        </section>
  
       {showDetails === false?(
         
           <section className={styles.G_search_Resumen_Body}>
            <div className={styles.G_search_Resumen}>
              <p className={styles.G_search_Resumen_ttile}>Resumen de la cerda: <span className={styles.G_search_Resumen_text2}>{totalData.NoDelCerdo}</span> </p>
              <p className={styles.G_search_Resumen_text}>Cantidad: <span className={styles.G_search_Resumen_text2}> {generalSearchData.length}</span> </p>
              <p className={styles.G_search_Resumen_text}>No Del Cerdo: <span className={styles.G_search_Resumen_text2}>{totalData.NoDelCerdo}</span> </p>
              <p className={styles.G_search_Resumen_text}>No Parto: <span className={styles.G_search_Resumen_text2}>{totalData.NoParto}</span>  </p>
              <p className={styles.G_search_Resumen_text}>No De Lechones: <span className={styles.G_search_Resumen_text2}>{totalData.NoDeLechones}</span> </p>
              <p className={styles.G_search_Resumen_text}>Vivos: <span className={styles.G_search_Resumen_text2}>{totalData.Vivos}</span> </p>
              <p className={styles.G_search_Resumen_text}>Muertos: <span className={styles.G_search_Resumen_text2}>{totalData.Muertos}</span> </p>
            </div>
  
            <div className={styles.G_Search_graph_body}>
              {/*<p className='G_S_graph_body_Text'>Porsentanje De Vivos y Muertos</p>*/}
  
              <div className={styles.gragh_Conatiner}>
                 <div className={styles.G_S_graph_box} style={{height:`${Muertos}vw`, backgroundColor:'#327C6B'}} >
                 <p className={styles.G_S_graph_box_Text}>{textMuerto}%</p>
                 <p className={styles.G_S_graph_box_titile}>Muertos</p>    
                </div>
              </div>
            
              <div className={styles.gragh_Conatiner}>
                <div className={styles.G_S_graph_box} style={{height:`${Vivos}vw`,  backgroundColor:'#327C6B'}}>
                     <p className={styles.G_S_graph_box_Text}>{textVivos}%</p>
                     <p className={styles.G_S_graph_box_titile}>Vivos</p>
                </div>
              </div>
            
            </div>
  
            </section>
       ):(
       
  
        <div className={styles.Gestation_S_info_container}>
            {
              generalSearchData.length > 0 ? (generalSearchData.map((list, index) => {
                return (
                  <div className={styles.Gestation_S_info_body} key={index}>
        
                    <header className={styles.Gestation_info_header}>
                      <p className={styles.Gestation_info_header_title}>Gestación {index + 1}</p>
                     
                      <div className={styles.Gestation_info_header_btn}>
                                <span className={styles.Gestation_info_header_delete} onClick={()=> openUpdateModal(list.id)}>
                                  <FontAwesomeIcon  icon={faPenToSquare} size={'xl'} color={'#000'} />
                                </span>
                                <button className={styles.Gestation_info_header_delete} onClick={()=>handleOpen(list.id, list.NoDelCerdo)}>
                                  <FontAwesomeIcon icon={faTrash}  color={'#000'} />  
                                </button>
                        </div>
        
                    </header>
        
                    <div className={styles.Gestation_S_info_text_Container}>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >Fecha:</span > {list.Hoy}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2}>No del cerdo:</span > {list.NoDelCerdo}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >Edad:</span > {list.Edad}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >No cerda:</span > {list.NoCerda}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >No parto:</span > {list.NoParto}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >Inicio de gestación:</span > {list.InicioDeGestación}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >Fin de gestación</span > {list.FinDeGestación}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >No de lechones</span > {list.NoDeLechones}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >Vivos:</span > {list.Vivos}</p>
                      <p className={styles.Gestation_S_info_text}><span className={styles.Gestation_info_text2} >Muertos:</span > {list.Muertos}</p>
        
                    </div>
        
                  </div>
                )
        
              })) : <></>
            }
        </div>
       ) }
       
  
      <Modal
          visible={isOpen}
          title={'Esta seguro que deseas eliminar esta información?'}
          button1={'Descartar'}
          button2={'Borrar'}
          fnButton1={()=> setIsOpen(false)}
          fnButton2={()=> remove(removeItem.id)}
  
        />
  
  
      <Modal
       visible={openModalSearch}
       title={'No Se encontro '}
       button1={'Ok'} 
       fnButton1={() => setOpenModalSearch(false)} /> 
  
     <UpdateGestation visible={showUpdate}  id={updateId} showUpdate={showUpdate} 
             setShowUpdate={setShowUpdate} generalData={generalSearchData} setGeneralData={setGeneralSearchData} />
  
      </div>
      
     ):(<></>)}
    </>
   

    
  )
}