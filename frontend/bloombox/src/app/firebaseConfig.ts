  import { initializeApp } from "firebase/app";
  import { environment } from "./environment/environment"; // Import the environment file

  const firebaseConfig = environment.firebase;

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export default app;
