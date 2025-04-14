import React, { useState, useEffect, useContext } from "react"

//INTERNAL IMPORT
import {
  Table,
  Form,
  Services,
  Profile,
  CompleteShipment,
  GetShipment,
  StartShipment,
} from "../Components/index"
import { TrackingContext } from "../Context/Tracking"

const index = () => {
  const {
    currentUser,
    criarEnvio,
    consultarTodosOsEnvios,
    finalizarEnvio,
    consultarEnvio,
    iniciarEnvio,
    consultarQuantidadeEnvio
  } = useContext(TrackingContext);

  //STATE VARIABLE
  const [createShipmentModel, setCreateShipmentModel] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [startModal, setStartModal] = useState(false)
  const [completeModal, setCompleteModal] = useState(false)
  const [getModel, setGetModel] = useState(false)
  //DATA STATE VARIABLE
  const [allShipmentsData, setAllShipmentsData] = useState()

  useEffect(() => {
    const getCampaignsData = consultarTodosOsEnvios()

    return async () => {
      const allData = await getCampaignsData
      setAllShipmentsData(allData)
    }
  }, [])

  return (
    <>
      <Services
        setOpenProfile={setOpenProfile}
        setCompleteModal={setCompleteModal}
        setGetModel={setGetModel}
        setStartModal={setStartModal}
      />
      <Table
        setCreateShipmentModel={setCreateShipmentModel}
        allShipmentsData={allShipmentsData}
      />
      <Form
        createShipmentModel={createShipmentModel}
        criarEnvio={criarEnvio}
        setCreateShipmentModel={setCreateShipmentModel}
      />
      <Profile
        openProfile={openProfile}
        setOpenProfile={setOpenProfile}
        currentUser={currentUser}
        consultarQuantidadeEnvio={consultarQuantidadeEnvio}
      />
      <CompleteShipment
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        finalizarEnvio={finalizarEnvio}
      />
      <GetShipment
        getModel={getModel}
        setGetModel={setGetModel}
        consultarEnvio={consultarEnvio}
      />
      <StartShipment
        startModal={startModal}
        setStartModal={setStartModal}
        iniciarEnvio={iniciarEnvio}
      />
    </>
  )
}

export default index