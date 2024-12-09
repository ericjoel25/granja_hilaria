import { useState } from "react";
import Logo from '../../componets/imagenes/granja.webp'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'; 
import firebase from "../../componets/firebase/firebase";
import  '../../componets/styles/loginViewStyle.css'; 
import { validateEmail } from "../../componets/firebase/validation";
import {Modal} from "../../componets/modal";


const auth = getAuth(firebase)

export default function SignIn(props) {

    const {setChange} = props; 

    const [openModal, setOpenModal] = useState(false); 
    const [text, setText] = useState('')

    const [data, setData]= useState({
        email:'',
        password:'',
        password2:''
    })

    
 const handleTextChange =(value, name)=>{
    setData({...data, [name]: value.target.value}); 
   
 }

 function handelOpenModal(arg){
   setText(arg); 
   setOpenModal(true); 
 }

 function creatAccount(){
   let errors ={}

   if(!data.email || !data.password ){
       if(!data.email) errors.email=true;
       if(!data.password) errors.password=true;
      
       handelOpenModal('¡Por favor complete la información! 😎');
     return; 
     
   }
   
 if(!validateEmail(data.email)){
       errors.email=true;
  
       handelOpenModal(`El email: ${data.email} no es valido, por favor introduzca una información valida.`)

    return;
   }

    createUserWithEmailAndPassword(auth, data.email.trim(), data.password.trim())
    .then(()=>console.log('done'))

    .catch((error)=>{
     
      if(`${error}`=== 'FirebaseError: Firebase: Error (auth/email-already-in-use).'){
         handelOpenModal(`El correo ${data.email} ya esta registrado`);
      }
      if(`${error}`==='FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).'){
         handelOpenModal(`La contraseña debe tener al menos 6 caracteres ⚠️`)
      }
    
    })
 }


    return(
        <div className="Reg_body">
        <img src={Logo} className="logo" alt='Imagen'/>
        <input className="Reg_input" placeholder="Correo eletronico" type={'email'} value={data.email} onChange={(value)=>handleTextChange(value, 'email')} />
        <input className="Reg_input" placeholder="Contraseña" type={'password'} value={data.password} onChange={(value)=>handleTextChange(value, 'password')} />
        <input className="Reg_input" placeholder="Contraseña" type={'password'}   value={data.password2} onChange={(value)=>handleTextChange(value, 'password2')} />

        <button className="Reg_btn"  onClick={()=> creatAccount()}>Registrarse</button>
        <button className="Reg_btn" onClick={()=>setChange(true)}>Iniciar Sesión</button>
      
        {openModal? <Modal title={text} button1={'Ok'} fnButton1={()=> setOpenModal(false)}/>: <></>}
     </div>
    )
}