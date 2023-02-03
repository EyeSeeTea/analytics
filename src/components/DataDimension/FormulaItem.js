import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import {
    TYPE_INPUT,
    TYPE_DATAITEM,
    TYPE_OPERATOR,
    LAST_DROPZONE_ID,
} from './constants.js'
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
    highlighted,
    onClickItem,
    onDblClick,
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

    const activeIndex = active?.data.current.sortable.index || -1

    const overLastDropZone = over?.id === LAST_DROPZONE_ID

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
            // The item being dragged is being moved from the formula
            // so if the item is before the item being dragged, use the
            // BEFORE position. Otherwise use the AFTER position
            insertPosition = index > activeIndex ? AFTER : BEFORE
        }
    }

    if (isLast && overLastDropZone) {
        insertPosition = AFTER
    }

    const onClick = (tagname) => {
        if (tagname !== 'INPUT') {
            onClickItem()
        } else {
            inputRef.current && inputRef.current.focus()
        }
    }

    const onDoubleClick = () => {
        onDblClick({ index })
    }

    function handleSingleClick(e) {
        const tagname = e.target.tagName
        clearTimeout(clickTimeoutId)
        const to = setTimeout(function () {
            onClick(tagname)
        }, maxMsBetweenClicks)
        setClickTimeoutId(to)
    }

    function handleDoubleClick(e) {
        clearTimeout(clickTimeoutId)
        setClickTimeoutId(null)
        onDoubleClick(e)
    }

    const chipClasses = cx('chip', {
        inactive: !isDragging,
        insertBefore: insertPosition === BEFORE,
        insertAfter: insertPosition === AFTER,
        highlighted,
    })

    if (type === TYPE_INPUT) {
        return (
            <>
                <div
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                    className={isLast && 'isLast'}
                >
                    <div
                        className={chipClasses}
                        tabIndex={isLast ? 0 : -1}
                        onClick={handleSingleClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        <div className="content">
                            <div className="dndHandle">{DragHandleIcon}</div>
                            <span className="inputWidth">
                                <span
                                    className="widthMachine"
                                    aria-hidden="true"
                                >
                                    {value}
                                </span>
                                <input
                                    id={id}
                                    name={label}
                                    onChange={onInputChange}
                                    value={value}
                                    type="number"
                                    ref={inputRef}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <style jsx>{styles}</style>
            </>
        )
    } else {
        return (
            <>
                <div
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                    className={isLast && 'isLast'}
                    style={style}
                >
                    <div
                        className={chipClasses}
                        tabIndex={isLast ? 0 : -1}
                        onClick={handleSingleClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        <div
                            className={cx('content', {
                                dataitem: type === TYPE_DATAITEM,
                                operator: type === TYPE_OPERATOR,
                            })}
                        >
                            {type === TYPE_DATAITEM && (
                                <span className="icon">
                                    {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                                </span>
                            )}
                            <span className="label">{label || value}</span>
                        </div>
                    </div>
                    <style jsx>{styles}</style>
                </div>
            </>
        )
    }

    function onInputChange(e) {
        onChange({ index, value: e.target.value })
    }
}

FormulaItem.propTypes = {
    highlighted: PropTypes.bool,
    id: PropTypes.string,
    isLast: PropTypes.bool,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClickItem: PropTypes.func,
    onDblClick: PropTypes.func,
}

export default FormulaItem
