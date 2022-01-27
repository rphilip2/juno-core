import React, { useEffect } from 'react'
import Switch from '@mui/material/Switch'
import Modal from '@mui/material/Modal'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import NativeSelect from '@mui/material/NativeSelect'
import Box from '@mui/material/Box'
import {
  setAvatarVisibility,
  selectIsSettingsOpen,
  setIsSettingsOpen,
  setShowAvatar,
  setEmailFetchSize,
  selectEmailListSize,
} from '../../Store/utilsSlice'
import { useAppDispatch, useAppSelector } from '../../Store/hooks'
import * as S from './SettingsStyle'

const handleClose = (dispatch: Function) => dispatch(setIsSettingsOpen(false))

const Settings = () => {
  const dispatch = useAppDispatch()
  const isSettingsOpen = useAppSelector(selectIsSettingsOpen)
  const avatarVisible = useAppSelector(setAvatarVisibility)
  const fetchCount = useAppSelector(selectEmailListSize)

  const handleEmailListSizeChange = (e:any) => {
    localStorage.setItem('fetchSize', e.target.value)
    dispatch(setEmailFetchSize(e.target.value))
  }

  useEffect(() => {
    if (
      localStorage.getItem('showAvatar') === null ||
      (localStorage.getItem('showAvatar') !== 'true' &&
        localStorage.getItem('showAvatar') !== 'false')
    ) {
      localStorage.setItem('showAvatar', 'true')
      dispatch(setShowAvatar(localStorage.getItem('showAvatar') === 'true'))
    }
  }, [])

  const switchAvatarView = () => {
    if (localStorage.getItem('showAvatar') === 'true') {
      localStorage.setItem('showAvatar', 'false')
      dispatch(setShowAvatar(false))
    } else {
      localStorage.setItem('showAvatar', 'true')
      dispatch(setShowAvatar(true))
    }
  }

  return (
    <Modal
      open={isSettingsOpen}
      onClose={() => handleClose(dispatch)}
      aria-labelledby="modal-search"
      aria-describedby="modal-search-box"
    >
      <S.Dialog>
        <S.SettingsHeader>Settings</S.SettingsHeader>
        <S.SettingsDiv>
          <FormGroup>
            <FormControlLabel
              label="       Do you want to see Avatars?"
              control={
                <Switch
                  onClick={() => switchAvatarView()}
                  checked={avatarVisible}
                />
              }
            />

            <FormControlLabel  label=" Emails Fetched at a time" control={
              <Box sx={{ minWidth: 25 }}>
                  <NativeSelect
                    defaultValue={fetchCount}
                    inputProps={{
                      name: 'emailSize',
                      id: 'uncontrolled-native',
                    }}
                    onChange={handleEmailListSizeChange}
                  >
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                  <option value={35}>35</option>
                </NativeSelect>
              </Box>
            }/>
              

          </FormGroup>
        </S.SettingsDiv>
      </S.Dialog>
    </Modal>
  )
}

export default Settings
