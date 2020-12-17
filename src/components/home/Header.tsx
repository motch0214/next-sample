import Link from "next/link"
import React, { useState } from "react"

import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ErrorIcon from "@material-ui/icons/Error"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import ImageIcon from "@material-ui/icons/Image"
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import NetworkWifiIcon from "@material-ui/icons/NetworkWifi"
import PersonIcon from "@material-ui/icons/Person"

import { useFirebase } from "components/FirebaseContext"
import useUserState from "components/auth/useUserState"

import styles from "./Header.module.scss"

const Header: React.FC = () => {
  const { getFirebase } = useFirebase()
  const { user, initialized } = useUserState()

  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const logout = async () => {
    setAnchor(null)
    const firebase = await getFirebase()
    await firebase.auth().signOut()
  }

  return (
    <div className="flex items-center justify-end w-full max-w-4xl px-4 py-2 mx-auto">
      {initialized ? (
        user ? (
          <IconButton
            className="p-2"
            onClick={(e) => setAnchor(e.currentTarget)}
          >
            {user.photoUrl ? (
              <Avatar src={user.photoUrl} alt="Avatar" />
            ) : (
              <PersonIcon />
            )}
          </IconButton>
        ) : (
          <Link href="/signup" passHref>
            <Button color="primary" variant="contained">
              Signup
            </Button>
          </Link>
        )
      ) : null}
      <Menu
        classes={{ list: styles.menu }}
        anchorEl={anchor}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!anchor}
        onClose={() => setAnchor(null)}
      >
        <div className="px-4 py-2 text-sm text-black text-opacity-50">
          {user?.name ?? ""}
        </div>
        <Separator />
        <MenuItem>
          <Link href="/communication">
            <a className={styles.item}>
              <div className={styles.icon}>
                <NetworkWifiIcon />
              </div>
              Communication
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/privacy">
            <a className={styles.item}>
              <div className={styles.icon}>
                <InsertDriveFileIcon />
              </div>
              Privacy Policy
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/gallary">
            <a className={styles.item}>
              <div className={styles.icon}>
                <ImageIcon />
              </div>
              Gallary
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href={{ pathname: "/throw", query: { type: "SSR" } }}>
            <a className={styles.item}>
              <div className={styles.icon}>
                <ErrorIcon />
              </div>
              Throw (SSR)
            </a>
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href={{ pathname: "/throw", query: { type: "Render" } }}>
            <a className={styles.item}>
              <div className={styles.icon}>
                <ErrorOutlineIcon />
              </div>
              Throw (Render)
            </a>
          </Link>
        </MenuItem>
        <Separator />
        <MenuItem>
          <div className={styles.item} onClick={logout}>
            <div className={styles.icon}>
              <ExitToAppIcon />
            </div>
            Logout
          </div>
        </MenuItem>
      </Menu>
    </div>
  )
}

const Separator: React.FC = () => {
  return <div className="w-full h-px bg-black bg-opacity-25" />
}

export default Header
