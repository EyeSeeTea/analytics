import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef, useEffect } from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import { TYPE_INPUT, TYPE_DATAELEMENT, LAST_DROPZONE_ID } from './constants.js'
import DragHandleIcon from './DragHandleIcon.js'
import styles from './styles/FormulaItem.style.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const maxMsBetweenClicks = 300

const FormulaItem = ({
    id,
    label,
    type,
    value = '',
    onChange,
    isLast,
    isHighlighted,
    onClick,
    onDoubleClick,
    hasFocus,
}) => {
    const {
        attributes,
        listeners,
        index,
        isDragging,
        isSorting,
        over,
        active,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id,
        attributes: { tabIndex: isLast ? -1 : 0 },
        data: { id, label, type, value },
    })

    const inputRef = useRef(null)

    const [clickTimeoutId, setClickTimeoutId] = useState(null)

    useEffect(() => {
        if (hasFocus && inputRef.current) {
            // setTimeout seems to be needed in order for the cursor
            // to remain in the input. Without it, the cursor disappears
            // even though the input still has the focus. Not sure why.
            setTimeout(() => {
                inputRef.current.focus()
            }, 0)
        }
    }, [inputRef, hasFocus, id])

    const activeIndex = active?.data.current.sortable.index || -1

    const style = transform
        ? {
              transform: isSorting
                  ? undefined
                  : CSS.Translate.toString({
                        x: transform.x,
                        y: transform.y,
                        scaleX: 1,
                        scaleY: 1,
                    }),
              transition,
          }
        : undefined

    let insertPosition = undefined
    if (over?.id === id) {
        // This item is being hovered over by the item being dragged
        if (activeIndex === -1) {
            //The item being dragged came from the expression options
            // so we will insert after
            insertPosition = AFTER
        } else {
            // The item being dragged is being moved in the formula
            // so if the item is before the item being dragged, use the
            // BEFORE position. Otherwise use the AFTER position
            insertPosition = index > activeIndex ? AFTER : BEFORE
        }
    } else if (isLast && over?.id === LAST_DROPZONE_ID) {
        insertPosition = AFTER
    }

    const handleClick = (e) => {
        const tagname = e.target.tagName
        clearTimeout(clickTimeoutId)
        const to = setTimeout(function () {
            if (tagname !== 'INPUT') {
                onClick(id)
            } else {
                inputRef.current && inputRef.current.focus()
            }
        }, maxMsBetweenClicks)
        setClickTimeoutId(to)
    }

    const handleDoubleClick = () => {
        clearTimeout(clickTimeoutId)
        setClickTimeoutId(null)
        onDoubleClick(id)
    }

    const handleChange = (e) => onChange({ index, value: e.target.value })

    const getContent = () => {
        if (type === TYPE_INPUT) {
            return (
                <>
                    <div className="dnd-handle">{DragHandleIcon}</div>
                    <span className="input-width">
                        <span className="width-machine" aria-hidden="true">
                            {value}
                        </span>
                        <input
                            id={id}
                            name={label}
                            onChange={handleChange}
                            value={value}
                            type="number"
                            ref={inputRef}
                        />
                    </span>
                    <style jsx>{styles}</style>
                </>
            )
        }

        if (type === TYPE_DATAELEMENT) {
            return (
                <>
                    <span className="icon">
                        {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                    </span>
                    <span className="data-element-label">{label}</span>
                    <style jsx>{styles}</style>
                </>
            )
        }

        return (
            <>
                <span className="operator-label">{label}</span>
                <style jsx>{styles}</style>
            </>
        )
    }

    return (
        <>
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                className={isLast && 'last-item'}
                style={style}
            >
                <div
                    className={cx('formula-item', {
                        inactive: !isDragging,
                        insertBefore: insertPosition === BEFORE,
                        insertAfter: insertPosition === AFTER,
                        highlighted: isHighlighted,
                    })}
                    tabIndex={isLast ? 0 : -1}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                >
                    <div className="content">{getContent()}</div>
                </div>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

FormulaItem.propTypes = {
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    hasFocus: PropTypes.bool,
    id: PropTypes.string,
    isHighlighted: PropTypes.bool,
    isLast: PropTypes.bool,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
}

export default FormulaItem
