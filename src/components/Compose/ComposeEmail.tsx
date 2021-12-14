import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useParams } from 'react-router-dom'
import InputBase from '@mui/material/InputBase'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { selectComposeEmail, SendComposedEmail, TrackComposeEmail } from '../../Store/composeSlice'
import useDebounce from '../../Hooks/useDebounce'
import * as local from '../../constants/composeEmailConstants'
import * as global from '../../constants/globalConstants'
import * as S from './ComposeStyles'
import emailValidation from '../../utils/emailValidation'
import { CustomButtonText } from '../Elements/Buttons'
import { CreateDraft, listRemoveDraft, resetDraftDetails, selectDraftDetails, UpdateDraft } from '../../Store/draftsSlice'
import { selectCurrentMessage } from '../../Store/emailDetailSlice'
import { useAppDispatch, useAppSelector } from '../../Store/hooks'

interface ComposeEmailProps {
  isReplying: boolean
  isReplyingListener: Function
  to: string
  subject: string
  threadId: string
}

const ComposeEmail = ({
  isReplying,
  isReplyingListener,
  to,
  subject,
  threadId,
}: ComposeEmailProps) => {
  const currentMessage = useAppSelector(selectCurrentMessage)
  const composeEmail = useAppSelector(selectComposeEmail)
  const draftDetails = useAppSelector(selectDraftDetails)
  const [toValue, setToValue] = useState<string>('')
  const debouncedToValue = useDebounce(toValue, 500)
  const [subjectValue, setSubjectValue] = useState('')
  const debouncedSubjectValue = useDebounce(subjectValue, 500)
  const [bodyValue, setBodyValue] = useState('')
  const debouncedBodyValue = useDebounce(bodyValue, 500)
  const [toError, setToError] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { messageId } = useParams<{ messageId: string }>()


  useEffect(() => {
    if (!messageId && Object.values(composeEmail).length > 0 && isEmpty(draftDetails)) {
      dispatch(CreateDraft())
    } else if (!isEmpty(draftDetails) && messageId) {
      dispatch(UpdateDraft())
    } else if (!isEmpty(draftDetails)) {
      dispatch(UpdateDraft())
    }
  }, [composeEmail, messageId])

  useEffect(() => {
    if (!isEmpty(draftDetails)) {
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
      }, 2500)
    }
  }, [draftDetails])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === global.TO) {
      setToValue(e.target.value)
    }
    if (e.target.id === global.SUBJECT) {
      setSubjectValue(e.target.value)
    }
    if (e.target.id === global.BODY) {
      setBodyValue(e.target.value)
    }
  }

  useEffect(() => {
    if (debouncedToValue && debouncedToValue.length > 0) {
      if (emailValidation(debouncedToValue)) {
        const updateEventObject = { id: global.TO, value: debouncedToValue }
        dispatch(TrackComposeEmail(updateEventObject))
      }
    }
  }, [debouncedToValue])

  useEffect(() => {
    if (debouncedSubjectValue) {
      const updateEventObject = {
        id: global.SUBJECT,
        value: debouncedSubjectValue,
      }
      dispatch(TrackComposeEmail(updateEventObject))
    }
  }, [debouncedSubjectValue])

  useEffect(() => {
    if (debouncedBodyValue) {
      const updateEventObject = { id: global.BODY, value: debouncedBodyValue }
      dispatch(TrackComposeEmail(updateEventObject))
    }
  }, [debouncedBodyValue])

  // Set the form values
  useEffect(() => {
    if (composeEmail) {
      setToValue(composeEmail.to)
      setSubjectValue(composeEmail.subject)
      setBodyValue(composeEmail.body)
    }
    if (to || subject) {
      to && setToValue(to)
      subject && setSubjectValue(subject)
    }
  }, [])

  useEffect(() => {
    if (currentMessage && currentMessage.id) {
      const updateEventObject = {
        id: 'id',
        value: currentMessage.id,
      }
      dispatch(TrackComposeEmail(updateEventObject))
    }
  }, [currentMessage])

  useEffect(() => {
    if (threadId) {
      const updateEventObject = {
        id: 'threadId',
        value: threadId,
      }
      dispatch(TrackComposeEmail(updateEventObject))
    }
  }, [threadId])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (toValue.length > 0) {
      if (emailValidation(toValue)) {
        dispatch(SendComposedEmail())
        dispatch(resetDraftDetails())
        dispatch(listRemoveDraft({ id: draftDetails.id }))
      } else {
        setToError(true)
      }
    }
  }

  return (
    <S.Wrapper isReplying={isReplying}>
      <S.UpdateContainer>
        {saveSuccess && <span className="text_muted">{local.DRAFT_SAVED}</span>}
      </S.UpdateContainer>
      <S.ComposerContainer className="composer composerIsVisible">
        <div className="base">
          <form onSubmit={onSubmit} autoComplete="off">
            <div style={{ marginBottom: `7px` }}>
              <div className="base">
                <S.Row>
                  <S.Label>
                    <label htmlFor="to" className="label-base">
                      {local.TO_LABEL}
                    </label>
                  </S.Label>
                  <FormControl error={toError} fullWidth>
                    <InputBase
                      id="to"
                      // label={local.TO_LABEL}
                      value={toValue ?? []}
                      onChange={handleChange}
                      required
                      fullWidth
                      autoFocus={!isReplying}
                    />
                    {toError && (
                      <FormHelperText id="component-helper-text">
                        {local.EMAIL_WARNING}
                      </FormHelperText>
                    )}
                  </FormControl>
                </S.Row>
                <S.Row>
                  <S.Label>
                    <label htmlFor="subject" className="label-base">
                      {local.SUBJECT_LABEL}
                    </label>
                  </S.Label>
                  <InputBase
                    id="subject"
                    // label={local.SUBJECT_LABEL}
                    value={subjectValue ?? ''}
                    onChange={handleChange}
                    fullWidth
                  />
                </S.Row>
                <S.Row>
                  <S.Label>
                    <label htmlFor="body" className="label-base">
                      {local.BODY_LABEL}
                    </label>
                  </S.Label>
                  <InputBase
                    id="body"
                    // label={local.BODY_LABEL}
                    multiline
                    value={bodyValue ?? ''}
                    onChange={handleChange}
                    minRows={12}
                    maxRows={25}
                    fullWidth
                    autoFocus={isReplying}
                  />
                </S.Row>
              </div>
            </div>
            <CustomButtonText
              type="submit"
              className="button button-small button-light"
              label={local.SEND_BUTTON}
              disabled={!toValue}
            />
            {isReplying && (
              <CustomButtonText
                className="button button-small"
                label={local.CANCEL_BUTTON}
                onClick={() => isReplyingListener(-1)}
              />
            )}
          </form>
        </div>
      </S.ComposerContainer>
    </S.Wrapper>
  )
}

export default ComposeEmail
