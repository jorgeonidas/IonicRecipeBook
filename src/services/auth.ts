import firebase from 'firebase';

export class AuthService{
    signup(email: string, password: string){
        //uso el servicio firebase para crear nueva cuenta dado email y usuario, retorna el resultado
        return firebase.auth().createUserWithEmailAndPassword(email,password);

        //en el caso que sea mi propio api-rest aca se haria lo mismo
    }

    signin(email: string, password: string){
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    logout(){
        firebase.auth().signOut(); //borra nuestro token
    }

    getActiveUser(){
        return firebase.auth().currentUser; //retorna el usuario autenticado actualmente
    }
}