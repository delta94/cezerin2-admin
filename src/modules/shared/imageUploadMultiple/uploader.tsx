import { Snackbar } from "@material-ui/core"
import RaisedButton from "material-ui/RaisedButton"
import React from "react"
import Dropzone from "react-dropzone"
import messages from "../../../lib/text"
import style from "./style.module.sass"

const MultiUploader = props => {
  const onDrop = files => {
    const form = new FormData()
    files.map(file => {
      form.append("file", file)
    })
    props.onUpload(form)
  }

  const { uploading } = props

  return (
    <>
      <Dropzone
        onDrop={onDrop}
        multiple
        disableClick
        noClick
        accept="image/*"
        ref={node => {
          dropzone = node
        }}
        style={{}}
        className={style.dropzone}
        activeClassName={style.dropzoneActive}
        rejectClassName={style.dropzoneReject}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {props.children != null ? (
              props.children
            ) : (
              <div className={style.dropzoneEmpty}>
                {messages.help_dropHere}
              </div>
            )}{" "}
          </div>
        )}
      </Dropzone>

      {!uploading && (
        <RaisedButton
          primary
          label={messages.chooseImage}
          style={{ marginLeft: 20, marginTop: 10 }}
          onClick={() => {
            dropzone.open()
          }}
        />
      )}

      <Snackbar open={uploading} message={messages.messages_uploading} />
    </>
  )
}

export default MultiUploader
