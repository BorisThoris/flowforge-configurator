import React, { Fragment, useRef } from "react";
import PropTypes from "prop-types";

import ButtonComp from "../../../genericButton/genericButton";

import "./adjustTagsModal.css";

const AdjustTagsModal = ({ tags, closeModal, removeTag, addTag }) => {
  const tagNameInput = useRef(null);

  const renderTags = (passedTags) => {
    return passedTags.map((tag, index) => {
      return (
        <div key={index} className="tagRow">
          <div className="tagName">{tag}</div>
          <ButtonComp
            text="Remove"
            buttonFunc={() => {
              removeTag(index, passedTags);
            }}
            noLoading
            customWidth
          />
        </div>
      );
    });
  };

  const trimInputAndAddTag = () => {
    const tempInputValue = tagNameInput.current.value;
    const trimmedInputValue = tempInputValue.replace(/ /g, "");
    tagNameInput.current.value = trimmedInputValue;
    addTag(tagNameInput.current.value, tags);
  };

  return (
    <Fragment>
      <div
        className="modal"
        onClick={() => {
          closeModal();
        }}
      ></div>
      <div className="modalForm">
        <ButtonComp
          buttonFunc={() => {
            closeModal();
          }}
          text="Go back"
          noLoading
        />

        <div className="title">Current Tags: </div>
        <div className="subTitle">(5 max)</div>

        <div className="addTag">
          <input type="text" ref={tagNameInput} placeholder="Tag name" />
          <ButtonComp
            required
            text="Add Tag"
            noLoading
            buttonFunc={trimInputAndAddTag}
          />
        </div>

        <div>{tags.length > 0 ? renderTags(tags) : <div>No Tags</div>}</div>
      </div>
    </Fragment>
  );
};

AdjustTagsModal.propTypes = {
  tags: PropTypes.array.isRequired,
  closeModal: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
};

export default AdjustTagsModal;
