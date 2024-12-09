import {useState} from "react"; 
import  '../../componets/styles/loginViewStyle.css'; 
import Imagen from '../../componets/imagenes/fondo7.webp';
import Logo from '../../componets/imagenes/granja.webp';
import Login from "./login";
import SignIn from "./singin";



export default function LogingView(){

const [change, setChange] = useState(true)


    return(
        <section className="LogingView_Body">
            <div className="logingView_box">
               <img src={Logo} className="logo2" alt='Imagen'/>
               <img src={Imagen} alt='Imagen' className='loging_img' />
            </div>
            
            <div className="logingView_box2">
                {change? <Login setChange={setChange} />: <SignIn setChange={setChange} /> }
            </div>
        </section>
    )
}