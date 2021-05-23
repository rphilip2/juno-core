import React, { useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import EmailListItem from './EmailListItem/EmailListItem'
import { connect } from 'react-redux'
import { loadEmails } from '../Store/actions'
import './../App.scss'
import Emptystate from './Elements/EmptyState'

const LOAD_OLDER = 'Load older messages'
const MAX_RESULTS = 20
const INBOX_LABELS = ['UNREAD', 'INBOX']

const mapStateToProps = (state) => {
  const {
    labelIds,
    metaList,
    nextPageToken,
    emailList,
    isLoading,
    loadedInbox,
  } = state
  return {
    labelIds,
    metaList,
    nextPageToken,
    emailList,
    isLoading,
    loadedInbox,
  }
}

const EmailList = ({
  labelIds,
  dispatch,
  metaList,
  nextPageToken,
  emailList,
  isLoading,
  loadedInbox,
}) => {
  useEffect(() => {
    if (labelIds && !loadedInbox.includes(labelIds)) {
      const params = {
        labelIds: labelIds,
        maxResults: MAX_RESULTS,
      }
      dispatch(loadEmails(params))
    }
  }, [labelIds])

  const loadNextPage = (labelIds, nextPageToken) => {
    if (labelIds && nextPageToken) {
      const params = {
        labelIds: labelIds,
        nextPageToken: nextPageToken,
        maxResults: MAX_RESULTS,
      }
      dispatch(loadEmails(params))
    }
  }

  const standardizedLabelIds =
    labelIds && !Array.isArray(labelIds) ? [labelIds] : labelIds
  const filteredEmailList =
    emailList &&
    emailList.filter((threadElement) =>
      threadElement.thread.messages.map((item) =>
        item.labelIds.includes(...standardizedLabelIds)
      )
    )

  const renderEmailList = (filteredEmailList) => {
    console.log(filteredEmailList)
    return (
      <>
        <div className="scroll">
          <div className="tlOuterContainer">
            <div className="thread-list">
              {filteredEmailList && (
                <div className="base">
                  {filteredEmailList.map((email) => (
                    <EmailListItem key={email.thread.id} email={email} />
                  ))}
                </div>
              )}
            </div>
            {nextPageToken && labelIds.includes(...INBOX_LABELS) && (
              <div className="d-flex justify-content-center mb-5">
                {!isLoading && (
                  <button
                    className="btn btn-sm btn-light"
                    disabled={isLoading}
                    onClick={() => loadNextPage(labelIds, nextPageToken)}
                  >
                    {LOAD_OLDER}
                  </button>
                )}
                {isLoading && <CircularProgress />}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {loadedInbox.includes(labelIds) &&
        filteredEmailList.length > 0 &&
        renderEmailList(filteredEmailList)}
      {!isLoading &&
        loadedInbox.includes(labelIds) &&
        filteredEmailList.length === 0 && <Emptystate />}
      {isLoading && filteredEmailList.length === 0 && (
        // {isLoading && !loadedInbox.includes(labelIds) && (
        <div className="mt-5 d-flex justify-content-center">
          <CircularProgress />
        </div>
      )}
    </>
  )
}

export default connect(mapStateToProps)(EmailList)
