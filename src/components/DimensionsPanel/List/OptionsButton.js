import { IconMore16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const OptionsButton = ({ style, onClick }) => (
    <button style={style} onClick={onClick}>
        <IconMore16 />
    </button>
)

OptionsButton.propTypes = {
    style: PropTypes.object,
    onClick: PropTypes.func,
}

export default OptionsButton
