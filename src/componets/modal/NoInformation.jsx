
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import logo from '../imagenes/granja.webp';
import {noInformationStyle} from '../../styles'; 



/** This component need these =>  show={show} setShow={setShow}  */
export function NoInformation(props){

     const {setShow, show} = props

    return(
        <div className={noInformationStyle.noInfo_container}>

          <div className={`${noInformationStyle.noInfo_body} ${noInformationStyle.animate}`}>
            <img src={logo}   className={noInformationStyle.noInfo_Icon}/>
             <h3>¡No hay información guardada!</h3>
            <p>Click en el icono para Agregar información</p>
            
            <FontAwesomeIcon onClick={()=>setShow(!show)} className={noInformationStyle.G_header_btn} title={'Agregar'} icon={faCirclePlus} />

          </div>
           
        </div>
    )
} 