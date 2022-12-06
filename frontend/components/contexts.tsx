import React from "react";
import Client from "../lib/client";

export const ClientContext = React.createContext<Client>(new Client({}));
