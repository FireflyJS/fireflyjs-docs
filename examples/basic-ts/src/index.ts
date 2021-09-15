import firefly, { SchemaTypes } from "@fireflyjs/core"
import admin from "firebase-admin"

const main = async() => {
    /**
     * Initialize admin SDK to use your firebase project
     */
    process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
    admin.initializeApp({
        projectId: "demo-firefly"
    });
    const firestore = admin.firestore();

    /**
     * Create a default connection. This connection must be unique to the firestore instance used.
     */
    const defaultConn = firefly.createConnection(firestore);

    /**
     * Define the type for Model Schema
     */
    type User = {
        email: string,
        age: number,
        name: {
            first: string,
            last: string
        }
    };

    /**
     * Define Schema for the Model.
     */
    const schema = SchemaTypes.object<User>().keys({
        email: SchemaTypes.string().required(),
        age: SchemaTypes.number().default(18),
        name: SchemaTypes.object<User["name"]>().keys({
            first: SchemaTypes.string().uppercase(),
            last: SchemaTypes.string().uppercase(),
        })
    });

    /**
     * Initialize the Model using default connection and schema
     */
    const UserModel = defaultConn.model<User>("user", schema);

    /**
     * Add documents to the user model
     */
    const userDoc = await UserModel.create({
        email: "JohnDoe@mail.com",
        name: {
            first: "John",
            last: "Doe"
        }
    });

    /**
     * Read data from Document.
     */
    const data = await userDoc.data();
    console.log("Data added", data);

    /**
     * Update the document
     */
    await userDoc.update({
        age: 20
    });

    const updatedData = await userDoc.data();
    console.log("Updated data", updatedData);

    /**
     * Query document from User Model
     */
    const queriedDoc = await UserModel.findOne({
        email: "JohnDoe@mail.com"
    }).exec();

    console.log("Id of the queried document", queriedDoc?.id);
};

main();