import { useState } from "react";
import Logo from '../../componets/imagenes/granja.webp'; 
import  '../../componets/styles/loginViewStyle.css'; 
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'; 
import firebase from "../../componets/firebase/firebase";
import { validateEmail } from "../../componets/firebase/validation";
import {Modal} from "../../componets/modal";

const auth = getAuth(firebase)


 export default function Login (props){

     const {setChange} = props; 

    const [data, setData]= useState({ email:'', password:'' }); 

    const [openModal, setOpenModal] = useState(false); 
    const [text, setText] = useState('')

 const handleTextChange =(value, name)=>{
    setData({...data, [name]: value.target.value}); 
   
 }

 function handelOpenModal(arg){
   setText(arg); 
   setOpenModal(true); 
 }

 const sigIn =()=>{
    
    let errors ={}

    if(!data.email || !data.password ){
        if(!data.email) errors.email=true;
        if(!data.password) errors.password=true;
       
        handelOpenModal('¡Por favor complete la información! 😎');
      return; 
    }   
    
  if(!validateEmail(data.email)){
        errors.email=true;
   
        handelOpenModal(`El email: ${data.email} no es valido, 
         por favor introduzca una información valida.
        `)
     return;
    }
  
     signInWithEmailAndPassword(auth, data.email.trim(), data.password.trim())
     .then((userCredential)=>{

         
     })
     .catch((error)=>{
         if(`${error}` ==='FirebaseError: Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).'){
            handelOpenModal(`El acceso a esta cuenta se ha inhabilitado temporalmente debido a muchos intentos fallidos.`)
         }

         if(`${error}` ==='FirebaseError: Firebase: Error (auth/wrong-password).'){
            handelOpenModal('La contraseña es incorrecta⚠️. Intente nuevamente')
         }

         if(`${error}` ==='FirebaseError: Firebase: Error (auth/user-not-found).'){
            handelOpenModal(`⚠️ El usuario ${data.email} no esta registrato.`)
         }
        
        
    })
 }

      return(
          <div className="Reg_body">
             <img src={Logo} className="logo" alt='Imagen'/>
             <input className="Reg_input" placeholder="Correo eletronico" type={'email'} value={data.email} onChange={(value)=>handleTextChange(value, 'email')} />
             <input className="Reg_input" placeholder="Contraseña" type={'password'}  value={data.password} onChange={(value)=>handleTextChange(value, 'password')}/>

             <button className="Reg_btn" onClick={()=> sigIn()} >Iniciar Sesión</button>
             <button className="Reg_btn" onClick={()=>setChange(false)}>Registrarse</button>
          <Modal 
            visible={openModal} 
            title={text} 
            button1={'Ok'} 
            fnButton1={()=> setOpenModal(false)}/> 


          </div>
      )
  }
