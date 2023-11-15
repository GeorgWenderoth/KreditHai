import {Button} from "react-bootstrap";
import React, {useState} from "react";
import "./header.scss";
import {ErrorMessage, Formik, Form, Field} from 'formik';


export function ToDoHeader(props){

    /**
     * Übergibt eingabe (Itemname) an props.handleSubmit
     * @param event
     */
   

    const onSubmit = (values, { setSubmitting}) => {
        props.handleSubmit(values.todopunkt);
        setSubmitting(false);
        /* props.handleSubmit(values.todopunkt).finally( ()=> {
                      setSubmitting(false);
                  });
                  */

    }
    /**
     * Überprüft ob die Eingaben korrekt sind, gibt Fehlermeldung aus wenn nicht
     * @param values
     * @returns {{}}
     */
    const validate = (values)=> {
        const errors = {};
        console.log("Values: ", values);
        if(!values.todopunkt){
            errors.todopunkt = "To-do-Punk is needed"
        }
         if (/[^a-zA-Z0-9 -]+/g.test(values.todopunkt)  ){
            errors.todopunkt = 'Invalid To-do-Punk -> Keine Sonderzeichen';
        }
         if(!/[a-zA-Z]+/g.test(values.todopunkt) ){
             errors.todopunkt = 'Mindestens ein Buchstabe'
         }
        return errors;
    }

    /**
     * speichert veränderungen bei der eingabe onChange im state
     * @param event
     */

    return(
        <div className="header">
            <h1 className="ueberschrift">Kredit Hai</h1>
            <h3 className="ueberschrift">Zahltag</h3>
            <Formik initialValues={{todopunkt: ""}} validate={validate} onSubmit={onSubmit}>
                {
                    ({
                        isSubmitting,
                        errors,
                        values,
                    }) => (
                        <Form className="row g-3 justify-content-center" >
                            <div className="col-auto">
                                <Field type="text" name={"todopunkt"}  className="form-control"  id="inp" placeholder="To-do"/>
                                <ErrorMessage name={"todopunkt"} />
                            </div>
                            <div className="col-auto">
                                <Button type="submit" className="btn-secondary">Hinzufügen</Button>
                            </div>
                           
                        </Form>
                    )
                }
            </Formik>
        </div>
    )
}


