import { Button, Paper } from "@material-ui/core"
import React, { useState } from "react"
import api from "../../../../lib/api"
import messages from "../../../../lib/text"
import style from "./style.module.sass"

const ActionComponent = props => {
  const [loading, setLoading] = useState(false)

  const handleActionCall = () => {
    const { action, serviceId, fetchServiceLogs } = props
    setLoading(true)

    return api.webstore.services.actions
      .call(serviceId, action.id)
      .then(() => {
        setLoading(false)
        fetchServiceLogs()
      })
      .catch((error: any) => {
        alert(error)
        setLoading(false)
        fetchServiceLogs()
      })
  }

  const { action } = props
  return (
    <div className={style.action}>
      <div className="row middle-xs">
        <div className="col-xs-7" style={{ fontSize: "14px" }}>
          {action.description}
        </div>
        <div className="col-xs-5" style={{ textAlign: "right" }}>
          <Button color="primary" disabled={loading} onClick={handleActionCall}>
            {action.name}
          </Button>
        </div>
      </div>
    </div>
  )
}

const ServiceActions = ({ actions, serviceId, fetchServiceLogs }) => {
  const buttons = actions.map((action, index) => (
    <ActionComponent
      key={index}
      action={action}
      serviceId={serviceId}
      fetchServiceLogs={fetchServiceLogs}
    />
  ))

  return (
    <div style={{ maxWidth: 720, width: "100%" }}>
      <div className="gray-title" style={{ margin: "15px 0 15px 20px" }}>
        {messages.serviceActions}
      </div>
      <Paper className="paper-box" elevation={1}>
        <>{buttons}</>
      </Paper>
    </div>
  )
}

export default ServiceActions
