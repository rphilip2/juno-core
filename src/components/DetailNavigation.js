import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { NavButton, Wrapper } from './DetailNavigationStyles'

const mapStateToProps = (state) => {
  const { currEmail, metaList, isLoading } = state
  return { currEmail, metaList, isLoading }
}

const DetailNavigation = ({ metaList, currEmail }) => {
  const [currLocal, setCurrLocal] = useState('')
  const [viewIndex, setViewIndex] = useState(0)
  const history = useHistory()

  const NavigatePreviousMail = () => {
    history.push(metaList[viewIndex - 1].id)
  }
  const NavigateNextMail = () => {
    history.push(metaList[viewIndex + 1].id)
  }
  const CloseMail = () => {
    history.push(`/inbox`)
  }

  const isDisabledPrev = metaList[viewIndex - 1] === undefined ? true : false
  const isDisabledNext = metaList[viewIndex + 1] === undefined ? true : false

  useEffect(() => {
    if (currEmail !== currLocal) {
      setCurrLocal(currEmail)
      const viewingIndex = metaList
        .map(function (e) {
          return e.id
        })
        .indexOf(currEmail)
      setViewIndex(viewingIndex)
    }
  }, [currEmail])

  return (
    <Wrapper>
      <NavButton
        onClick={() => NavigatePreviousMail()}
        disabled={isDisabledPrev}
      >
        <FiChevronLeft size={20} />
      </NavButton>
      <NavButton onClick={() => NavigateNextMail()} disabled={isDisabledNext}>
        <FiChevronRight size={20} />
      </NavButton>
      <NavButton onClick={CloseMail}>
        <FiX size={20} />
      </NavButton>
    </Wrapper>
  )
}

export default connect(mapStateToProps)(DetailNavigation)
