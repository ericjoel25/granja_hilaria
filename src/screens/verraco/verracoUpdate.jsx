import { useEffect, useState } from 'react';
import '../../componets/styles/gestationStyle.css';
import firebase from '../../componets/firebase/firebase';
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import {getAuth} from 'firebase/auth';
import {Modal} from "../../componets/modal";



const db = getFirestore(firebase);
const auth = getAuth(firebase); 

/**
 *  Create => const [show, setShow]=useState(false).
 * Then provided  visible={show} as props.
 **/


export default function UpdateVerraco(props) {
   
    const {visible, id, showUpdate, setShowUpdate, generalData, setGeneralData } = props; 
    const collectionName = `Verraco-${auth.currentUser.uid}`; 
    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState({
        NoDelCerdo:'',
        Fecha:'',
        Edad:'',
        NoDeLaCerdaGestó:'',
        Hoy:new Date(),
        id:'',
        startAt: new Date().getTime()

    })

   

 useEffect(()=>{

    CustomerInfo()
 
},[showUpdate])   



const text = '¡Por favor complete el formulario! 😅';


const handelTextChange=(value, name)=>{
   setFormData({...formData, [name]:value.target.value})
  
}


const CustomerInfo = async () => {


    const Información = await generalData.filter((list)=>{
        let response= list.id === id; 
     
         return response; 
     }) 

    setFormData(...Información);

}



const submit= async ()=>{
   
  let errors = {};

    const Info= {
        NoDelCerdo: formData.NoDelCerdo,
        Fecha: formData.Fecha,
        Edad: formData.Edad,
        NoDeLaCerdaGestó: formData.NoDeLaCerdaGestó,
        id:formData.id,
        Hoy:formData.Fecha,
        startAt:new Date()

       }

    if(!formData.NoDelCerdo.trim() || !formData.Edad.trim() || !formData.Fecha.trim() || !formData.NoDeLaCerdaGestó.trim()   
     ){
      
        if(!formData.NoDelCerdo) errors.NoDelCerdo=true;
        if(!formData.Edad) errors.Edad =true;
        if(!formData.Fecha) errors.Fecha=true;
        if(!formData.NoDeLaCerdaGestó) errors.NoDeLaCerdaGestó=true;
      
        setOpenModal(true)
  

      return;
    } 

      try {

         const collectionRef = doc(db, collectionName, id)
         await updateDoc(collectionRef, Info).then(()=> {

            //setData([Info, ...data])

            const Información = generalData.filter((list, index)=>{
                let response= list.id !== id; 
             
                 return response; 
             }) 
        

            setGeneralData([...Información, Info]);
            //getFirebaseInfo(collectionName);
           })

       } catch (error) {

          console.error("Error adding document: ", error)
       }

       setFormData({
        NoDelCerdo:'',
        Fecha:'',
        Edad:'',
        NoDeLaCerdaGestó:'',
        Hoy:new Date(),
        startAt: new Date().getTime()
     
       })
   
       setShowUpdate(!showUpdate)


}



    return(
        <>
          {visible?(
            <div className="G_modal_container">
            <div className="G_modal_body animate">

               <form className="G_modal_form">
                  <label className="V_modal_label">N. del cerdo:</label>
                   <input className="V_modal_input"  placeholder="N. del cerdo" type={'text'} value={formData?.NoDelCerdo || ''} onChange={(value)=> handelTextChange(value, 'NoDelCerdo')} />

                   <label className="V_modal_label">Fecha:</label>
                   <label className="V_modal_input">{formData?.Fecha || ''}</label>
                
                   <label className="V_modal_label">Edad:</label>
                   <input className="V_modal_input" placeholder="Edad"  type={'text'} value={formData?.Edad || ''} onChange={(value)=> handelTextChange(value, 'Edad')}/>

                   <label className="V_modal_label">No de la cerda que gestó:</label>
                   <input className="V_modal_input" placeholder="No de la cerda que gestó" type={'text'} value={formData?.NoDeLaCerdaGestó || ''} onChange={(value)=> handelTextChange(value, 'NoDeLaCerdaGestó')}/>
               </form>

               <section className="G_modal_btn_body">
                   <button  className="G_modal_btn" onClick={()=> setShowUpdate(!showUpdate)}>Cancelar</button>
                   <button className="G_modal_btn" onClick={()=>submit()} >Guardar</button>
               </section>
            </div>
           
           <Modal
             visible={openModal}
             title={text}
             button1={'Ok'} 
             fnButton1={()=> setOpenModal(false)}
             />
       
       
        </div>
          ):(
              <></>
          )

          }
         
        </>
        
    )
}