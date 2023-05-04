import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const reloadEnv = () => {
  dotenv.config({ path: "./.env" });
};

export { reloadEnv };
