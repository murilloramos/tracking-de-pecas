import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

// INTERNAL IMPORT
import tracking from "../Context/Tracking.json";
const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ContractABI = tracking.abi;

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
    new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
    //STATE VARIABLE
    const DappName = "Dapp Rastreamento";
    const [currentUser, setCurrentUser] = useState("");

    const criarEnvio = async (items) => {
        console.log(items);
        const { destinatario, horaColeta, distancia, custo } = items;

        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const createItem = await contract.contract.criarEnvio(
                destinatario,
                new Date(horaColeta).getTime(),
                distancia,
                ethers.utils.parseUnits(price, 18),
                {
                    value: ethers.utils.parseUnits(custo, 18)
                }
            );
            await createItem.wait();
            console.log(createItem);
        } catch (error) {
            console.log("Algo errado", error);
        }
    };

    const consultarTodosOsEnvios = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);

            const envios = await contract.consultarTodosProcessos();
            const todosProcessos = envios.map((envio) => ({
                remetente: envio.sender,
                destinatario: envio.destinatario,
                custo: ethers.utils.formatEther(envio.custo.toString()),
                horaColeta: envio.horaColeta.toNumber(),
                horaEntrega: envio.horaEntrega.toNumber(),
                distancia: envio.distancia.toNumber(),
                estaPago: envio.estaPago,
                status: envio.status,
            }));

            return todosProcessos;
        } catch (error) {
            console.log("Erro em consultar os envios");
        }
    };

    const consultarQuantidadeEnvio = async () => {
        try {
            if (!window.ethereum) return "Favor instalar o MetaMask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const quantidadeEnvio = await contract.consultarQuantidadeEnvio(accounts[0]);
            return quantidadeEnvio.toNumber();
        } catch (error) {
            console.log("Erro em consultar o envio");
        }
    };

    const finalizarEnvio = async (finalizar) => {
        console.log(finalizar);

        const { recevier, index } = finalizar;
        try {
            if (!window.ethereum) return "Favor instalar o MetaMask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const transaction = await contract.finalizarEnvio(
                accounts[0],
                remetente,
                index,
                {
                    gasLimit: 300000, // Mais seguro ter um limite de gas
                }
            );

            transaction.wait();
            console.log(transaction);
        } catch (error) {
            console.log("Erro ao finalizar envio", error);
        }
    };

    const consultarEnvio = async (index) => {
        console.log(index * 1);
        try {
            if (!window.ethereum) return "Favor instalar o MetaMask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const envio = await contract.consultarEnvio(accounts[0], index * 1);

            const UnicoEnvio = {
                remetente: envio[0],
                destinatario: envio[1],
                horaColeta: envio[2].toNumber(),
                horaEntrega: envio[3].toNumber(),
                distancia: envio[4].toNumber(),
                custo: ethers.utils.formatEther(envio[5].toString()),
                status: envio[6],
                estaPago: envio[7],
            };

            return UnicoEnvio;
        } catch (error) {
            console.log("Desculpa porém não existem envios");
        }
    };

    const iniciarEnvio = async (consultarProduto) => {
        const { destinatario, index } = consultarProduto;

        try {
            if (!window.ethereum) return "Favor instalar o MetaMask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            const web3modal = new Web3Modal();
            const connect = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const envio = await contract.iniciarEnvio(
                accounts[0],
                remetente,
                index * 1,
            );

            envio.wait();
            console.log(envio);
        } catch (error) {
            console.log("Sem envios", error);
        }
    };

    //--CHECK WALLET CONNECTED
    const carteiraEstaConectada = async () => {
        try {
            if (!window.ethereum) return "Favor instalar o MetaMask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length) {
                setCurrentUser(accounts[0]);
            } else {
                return "Sem conta";
            }
        } catch (error) {
            return "Sem conexão";
        }
    };

    //--CONNECT WALLET FUNCTION
    const conectarCarteira = async () => {
        try {
            if (!window.ethereum) return "Favor instalar o MetaMask";

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            setCurrentUser(accounts[0]);
        } catch (error) {
            return "Algo deu errado";
        }
    };

    useEffect(() => {
        carteiraEstaConectada();
    }, []);

    return (
        <TrackingContext.Provider
            value={{
                conectarCarteira,
                criarEnvio,
                consultarTodosOsEnvios,
                finalizarEnvio,
                consultarEnvio,
                iniciarEnvio,
                consultarQuantidadeEnvio,
                DappName,
                currentUser
            }}
        >
            {children}
        </TrackingContext.Provider>
    );
};