import { Paper } from "@material-ui/core"
import FontIcon from "material-ui/FontIcon"
import IconButton from "material-ui/IconButton"
import Snackbar from "material-ui/Snackbar"
import React, { useEffect, useState } from "react"
import Dropzone from "react-dropzone"
import messages from "../../../lib/text"
import style from "./style.module.sass"

const ImageUpload = (
  props: Readonly<{ uploading; onDelete; imageUrl; onUpload; children }>
) => {
  const [imagePreview, setImagePreview] = useState(props.imageUrl)

  const { uploading, imageUrl, onUpload, children } = props

  const onDelete = () => {
    setImagePreview(null)
    props.onDelete()
  }

  useEffect(() => {
    setImagePreview(imageUrl)
  }, [imageUrl])

  const onDrop = files => {
    const form = new FormData()
    form.append("file", files[0])
    onUpload(form)
  }

  const hasPreview = imagePreview !== null && imagePreview !== ""
  const previewIsFileUrl = hasPreview ? imagePreview.startsWith("http") : null

  let htmlPreview = (
    <div className={style.noImage}>
      <FontIcon
        style={{ fontSize: 90, color: "#cccccc" }}
        className="material-icons"
      >
        photo_camera
      </FontIcon>
      <div className={style.dropText}>{messages.help_dropHere}</div>
    </div>
  )

  if (hasPreview && previewIsFileUrl) {
    htmlPreview = <img src={imagePreview} />
  } else if (hasPreview && !previewIsFileUrl) {
    htmlPreview = <img src={imagePreview} />
  }

  return (
    <Paper elevation={1} square={true} style={{ width: 200 }}>
      <Dropzone
        onDrop={onDrop}
        multiple={false}
        disableClick={hasPreview}
        accept="image/*"
        ref={node => {
          dropzone = node
        }}
        style={{}}
        className={style.dropzone}
        activeClassName={style.dropzoneActive}
        rejectClassName={style.dropzoneReject}
      >
        {({ getRootProps, getInputProps }) =>
          children != null ? (
            children
          ) : (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={style.preview}>{htmlPreview}</div>
            </div>
          )
        }
      </Dropzone>

      <div className={style.footer}>
        <IconButton
          touch
          tooltip={messages.actions_upload}
          onClick={() => {
            dropzone.open()
          }}
          tooltipPosition="top-right"
        >
          <FontIcon color="rgba(0,0,0,0.5)" className="material-icons">
            file_upload
          </FontIcon>
        </IconButton>
        {hasPreview && (
          <IconButton
            touch
            tooltip={messages.actions_delete}
            onClick={onDelete}
            tooltipPosition="top-right"
          >
            <FontIcon color="rgba(0,0,0,0.5)" className="material-icons">
              delete
            </FontIcon>
          </IconButton>
        )}
      </div>
      <Snackbar open={uploading} message={messages.messages_uploading} />
    </Paper>
  )
}

export default ImageUpload
