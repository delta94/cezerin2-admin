import FlatButton from "material-ui/FlatButton"
import Snackbar from "material-ui/Snackbar"
import React from "react"
import Dropzone from "react-dropzone"
import messages from "../../../../../lib/text"
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
        ref={node => {
          dropzone = node
        }}
        style={{}}
        className={style.dropzone + (uploading ? ` ${style.uploading}` : "")}
        activeClassName={style.dropzoneActive}
        rejectClassName={style.dropzoneReject}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className={style.dropzoneEmpty}>
              {messages.help_dropHere}
              <FlatButton
                label={messages.chooseImage}
                className={style.button}
                onClick={() => {
                  dropzone.open()
                }}
              />
            </div>
          </div>
        )}
      </Dropzone>

      <Snackbar open={uploading} message={messages.messages_uploading} />
    </>
  )
}

export default MultiUploader
