import { useEffect, useState } from 'react';
import '../../componets/styles/vaccinationStyles/vaccination.css';
import firebase from '../../componets/firebase/firebase';
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import {Modal} from "../../componets/modal";



const db = getFirestore(firebase);
const auth = getAuth(firebase);


/**
 * @param {visible} props  provide the props visible={boalean}
 * @returns Open the modal with the form to set the information.
 */

export default function VaccinationUpdate(props) {

 
    const collectionName = `Destete-${auth.currentUser.uid}`;
    const { visible, id, showUpdate, setShowUpdate, generalData, setGeneralData } = props;
    const [openModal, setOpenModal] = useState(false)
    const [formData, setFormData] = useState({
        Fecha:'',
        TipoDeVacuna:'',
        Fecha2do:'',
        NoDeCerda:'',
        TipoDeVitamina:'',
        Hoy:new Date(),
        startAt: new Date().getTime()

    })



    useEffect(() => {

        CustomerInfo()

    }, [showUpdate])



    const text = '¡Por favor complete el formulario! 😅';


    const handelTextChange = (value, name) => {
        setFormData({ ...formData, [name]: value.target.value })

    }


    const CustomerInfo = async () => {

        //const collectionRef = doc(db, collectionName, id)
        // const document = await getDoc(collectionRef)
        // const Información = await document.data()

        const Información = generalData.filter((list, index) => {
            let response = list.id === id;

            return response;
        })

        setFormData(...Información);

    }



    const submit = async () => {

        let errors = {};

     
    const Info= {
        Fecha:formData.Fecha,
        TipoDeVacuna:formData.TipoDeVacuna,
        Fecha2do:formData.Fecha2do, 
        NoDeCerda:formData.NoDeCerda,
        TipoDeVitamina:formData.TipoDeVitamina,
        Hoy:formData.Hoy,
        id:formData.id,
        startAt:new Date()
       }

    if(!formData.Fecha.trim() || !formData.Fecha2do.trim() || !formData.TipoDeVacuna.trim() || !formData.NoDeCerda.trim()|| !formData.TipoDeVitamina
     
     ){
      
      if(!formData.Fecha) errors.Fecha=true;
      if(!formData.Fecha2do) errors.Fecha2do =true;
      if(!formData.TipoDeVacuna) errors.TipoDeVacuna=true;
      if(!formData.NoDeCerda) errors.NoDeCerda=true;
      if(!formData.TipoDeVitamina) errors.TipoDeVitamina=true;

      setOpenModal(true)


            return;
        }

        try {

            const collectionRef = doc(db, collectionName, id)
            await updateDoc(collectionRef, Info).then(() => {

                //setData([Info, ...data])

                const Información = generalData.filter((list, index) => {
                    let response = list.id !== id;

                    return response;
                })

                setGeneralData([Info, ...Información]);
                //getFirebaseInfo(collectionName);
            })

        } catch (error) {

            console.error("Error adding document: ", error)
        }

        setFormData({
        Fecha:'',
        TipoDeVacuna:'',
        Fecha2do:'',
        NoDeCerda:'',
        TipoDeVitamina:'',
        Hoy:new Date(),
        startAt: new Date().getTime()

        })

        setShowUpdate(showUpdate => !showUpdate)


    }



    return (
       <>
        {visible?(
             <div className="vaccination_modal_container">
             <div className="vaccination_modal_body animate">
 
             <form className="vaccination_modal_form">
                 
                 <label className="vaccination_modal_label">Fecha:</label>
                 <input className="vaccination_modal_input"   type={'date'} value={formData?.Fecha ||''} onChange={(value)=> handelTextChange(value, 'Fecha')} />
 
                 <label className="vaccination_modal_label">Tipo De Vacuna:</label>
                 <input className="vaccination_modal_input"  placeholder="Tipo De Vacuna" type={'text'} value={formData?.TipoDeVacuna ||''} onChange={(value)=> handelTextChange(value, 'TipoDeVacuna')} />
 
                <label className="vaccination_modal_label">Fecha 2do:</label>
                 <input className="vaccination_modal_input"   type={'date'} value={formData?.Fecha2do ||''} onChange={(value)=> handelTextChange(value, 'Fecha2do')} />
 
                 <label className="vaccination_modal_label">No. de cerda:</label>
                 <input className="vaccination_modal_input"  placeholder="No. de cerda" type={'text'} value={formData?.NoDeCerda ||''} onChange={(value)=> handelTextChange(value, 'NoDeCerda')} />
 
 
                 <label className="vaccination_modal_label">Tipo de Vitamina:</label>
                 <input className="vaccination_modal_input"  type={'text'} value={ formData?.TipoDeVitamina ||''} onChange={(value)=> handelTextChange(value, 'TipoDeVitamina')}/>
 
 
             </form>
 
 
                 <section className="vaccination_modal_btn_body">
                     <button className="vaccination_modal_btn" onClick={() => setShowUpdate(showUpdate => !showUpdate)}>Cancelar</button>
                     <button className="vaccination_modal_btn" onClick={() => submit()} >Guardar</button>
                 </section>
             </div>
 
              <Modal
                visible={openModal} 
                title={text} 
                button1={'Ok'} 
                fnButton1={() => setOpenModal(false)} 
                /> 
 
                
         </div>
        ):(<></>)}
       </>
    )
}