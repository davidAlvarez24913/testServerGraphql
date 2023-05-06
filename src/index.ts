import { ApolloServer, BaseContext } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"
import admin from 'firebase-admin';
import mysql from "mysql2/promise"
// import {db} from "./firebase"
admin.initializeApp({
  credential:admin.credential.cert({
    type: "service_account",
    project_id: "api-python-1c530",
    private_key_id: "6ecf7e268c626f6cffb90998ad0b35fb882d896b",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcbD9Kmemd4Tlh\nvU4o3GW84tY36k/GcQ0rT5jLYkmV9cssdDuRn/dkMu1FozYMMHLSGxJn4azNVt0J\n0EjfOnpFooW7jNi0fLIFnOVDxS8e3hEdMk5XG7cFpLRI4hb2s9YEoMfDzAlsV2w8\nvdOcPWMv6WiYbCzlKKTkyMSHPF16hidknTShG5IcalTg/oZ9bj+Xg/b5qPllJHmZ\nB8Cngn3uiHAUMIdzPOaCub2GDhwIzGjDTOGOc0QYPSUDRhy3m8tuMFERyv4jGsBp\nBh2I9jNs9BlJ3ocz1jz5xXdMQIwcJC40l2CLW/ZzP1jiyBsgRgksxxILpVK7zfKn\nM+R8fv+5AgMBAAECggEABjDIFxLhiJYyiisxG10TqM1m6zHnRN4YWsoLTLlmJavX\nvyTe82t4HQlNHqXDajsGG1G4hgORjdoA4gcTTnZ4lQuudwj91EilDoFMjK21PntJ\nvo8siHr2L4nKDzrCUfI7clMHQtl9JKmdfmTUB53o8we6in70EW+MMGmIrRLZJHK7\n89N6U2/90WLjaWl/Dnl3PgMKaWgnLhqdMg9JyeFQHBkZP+bZX9gr8o6k7M8AbtdI\nHX0OoOpF82faZY5frekPlyTIoKGQj+y8GKpqVMqy3ji8xYtm/3NqNoXbCiouJs55\nK+9ZLD0sJFvtNE4CqEtY0ClBSJ67NhzlkjlBGJhwfQKBgQDxVekyhEgAHigTIZCO\nwZ/wRgjif/S/SfWeB1KlCDmavgx7o/XzXF7mVAjnzPYUioXJ9MABqfOcaHX4sNfG\nVyPdn+xBc+mqfihDTF5pYC8vh2tjoyx+AGCH9ZpcVdSphVDE0ai8zfSDBEm02U7p\nmI+CKp/40T91MLuy3Se0szW3GwKBgQDp0QdTrxJt1Yw4+LCUdXCM3dV7ZEowuVLW\nzV0BM1AQzson3zuY3GAhPSghbv/g2XjO7zYY1n4WjeV3LSHrTCR93pH7AJN3xCT5\nQlwDmot6fdv3gq0QkKw/VMXF7FIxnn/2shxM111wfo4qo6IeGWr9PlbaqD7HMzXJ\nojXIxd+tuwKBgC5AWMDluSbMoMGJ3Tp+wTg7M9i0zSMb+YafwKcAPIn7gkjv02Mg\ngM+Dq3FBRqgJJDrgPSwUdiuzmWhf+/p3GNiQnaatoEqcgvri1/U6CdECEwK1cwFy\n8Q0ddMfdazRR6HjP9Za5ofK6D6YpP4ZlRpubr6zv7Ul4XYCaAdIPxmuhAoGAaFHS\nqwuZdVep0GFkp1gedzsiXINKdqK4yw2lSTvTpSweFdwLgxAP88SNex1DHNbqh6lC\nwaIxb26vypRgZdL7FQ2QpCSFpxHkTTHGS/VP9b7hvXSYMqPZtgfklYHyyiClhzPA\nXKhaEC7mzy9izXsZuRNvPO+D0uyOOwAcbw+Z1LECgYEA7S3ZXZufXe+Zo3SEKNcG\n2DKICAeruQtusRETH/nkyr6p7Pt3FiSkkLg3hVimBk8+1ZzO4TpODIFPsyHpU/50\ns9VigrqNqx/vwHmmHUmnThv18iRzqjYEclACmSQOijBYwsXmbCY5QzpPK5EMli3k\nVJWG6BDQps0jbzzgb5IF5js=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-hf1gy@api-python-1c530.iam.gserviceaccount.com",
    client_id: "110825372782921147537",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hf1gy%40api-python-1c530.iam.gserviceaccount.com"
  } as admin.ServiceAccount)
})

const connection = mysql.createPool({
  database:"garrapiniada",
  user:"2qo0yzkbomr8d61wdkz5",
  host:"aws.connect.psdb.cloud",
  password:"pscale_pw_svLpzBZGJUZ8GrfhNNTeHk73oJ0Pc0i1kmskJbf2Y76",
  ssl: {rejectUnauthorized:false},
})
const db = admin.firestore()

const typeDefs = `
type User{
  id: String!
  firstName: String!
}
type Query{
  listUsers(name:String):[User]
}
`
const resolvers = {
  Query:{
    listUsers: async ()=>{
      const [ usersplanetscale ] = await connection.query("SELECT * FROM users;")
      connection.end()
      
      const querySnapshot = await  db.collection("users").get()
      const usersfirebase = querySnapshot.docs.map( doc => doc.data());
      const users = usersfirebase.map( user => { return { id:user.id, firstName: user.first}})
      const result = Object.values(JSON.parse(JSON.stringify(usersplanetscale))).map( (res:{id: Number,name:String}) => { return{id:  res.id.toString(), firstName:res.name}});
      console.log([...result,...users])
      return [...users, ...result]
    }
  }
  };

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀🚀🚀  Server ready at: ${url} 🚀🚀🚀`);
