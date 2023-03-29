import Client from "../lib/client";
import React from "react";

export const ClientContext = React.createContext<Client>(new Client({}));
