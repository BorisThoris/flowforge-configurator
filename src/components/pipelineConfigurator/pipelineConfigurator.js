import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./pipelineConfiguratorStyle.css";

import channelService from "../../services/channelService";

import TagsModal from "./components/adjustTagsModal/adjustTagsModal";
import CustomOptionsSelect from "../customOptionSelect/customOptionsSelect";
import ButtonComp from "../genericButton/genericButton";

const DRAFT_STORAGE_KEY = "lastInputValues";

const getStoredDraft = () => {
  const storedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);

  if (!storedDraft) return null;

  try {
    const parsedDraft = JSON.parse(storedDraft);

    if (!parsedDraft || typeof parsedDraft !== "object") return null;

    return {
      label:
        typeof parsedDraft.label === "string" ? parsedDraft.label : undefined,
      tags: Array.isArray(parsedDraft.tags) ? parsedDraft.tags : undefined,
      activeFormChannel:
        Number.isInteger(parsedDraft.activeFormChannel) ||
        typeof parsedDraft.activeFormChannel === "string"
          ? parsedDraft.activeFormChannel
          : undefined,
    };
  } catch (error) {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    return null;
  }
};

const getDraftChannelIndex = (draftChannelIndex) => {
  if (draftChannelIndex === undefined) return 0;

  const channelIndex = parseInt(draftChannelIndex);

  return Number.isNaN(channelIndex) ? 0 : channelIndex;
};

const createFeedback = (type, message) => ({
  type: type,
  message: message,
});

const PipelineConfigurator = ({ i18n, channels, GetInitialData, SwitchLang }) => {
  const [pageHasLoaded, setPageHasLoaded] = useState(false);
  const [isTagsModalOpn, setIsTagsModalOpn] = useState(false);
  const [formFeedback, setFormFeedback] = useState(null);
  const [labelError, setLabelError] = useState("");
  const [tagError, setTagError] = useState("");
  //Form values
  const [label, setLabel] = useState("");
  const [tags, setTags] = useState([]);
  const [formChannels, setFormChannels] = useState([]);
  const [activeFormChannel, setActiveFormChannel] = useState(0);

  const langLocal = i18n.locale;
  const translations = i18n.translations[langLocal];
  const draftState = pageHasLoaded ? "Local draft active" : "Loading draft";
  const languageLabel = langLocal === "ar" ? "Arabic" : "English";

  useEffect(() => {
    GetInitialData();
  }, [GetInitialData]);

  useEffect(() => {
    if (pageHasLoaded) {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          label: label,
          tags: tags,
          activeFormChannel: activeFormChannel,
        })
      );
    }
  }, [label, activeFormChannel, pageHasLoaded, tags]);

  useEffect(() => {
    if (channels.length > 0) {
      const lastVals = getStoredDraft();
      const Pipeline = channelService.getPipeline(channels);

      if (lastVals) {
        setLabel(
          lastVals.label !== undefined ? lastVals.label : Pipeline.pipelineLabel
        );
        setTags(lastVals.tags || Pipeline.tags);
        setFormChannels(Pipeline.channels);
        setActiveFormChannel(getDraftChannelIndex(lastVals.activeFormChannel));
      } else {
        setLabel(Pipeline.pipelineLabel);
        setTags(Pipeline.tags);
        setFormChannels(Pipeline.channels);
      }

      if (!pageHasLoaded) {
        if (lastVals) {
          setFormFeedback(
            createFeedback("info", "Local draft restored from this browser.")
          );
        }
        setPageHasLoaded(true);
      }
    }
  }, [channels, pageHasLoaded]);

  const submitFunc = async (
    passedFormChannels,
    passedActiveFormChannel,
    passedLabel
  ) => {
    if (passedLabel.trim().length === 0) {
      setLabelError("Label is required before saving.");
      setFormFeedback(
        createFeedback("error", "Fix the highlighted field before saving.")
      );
      return;
    }

    setLabelError("");
    setFormFeedback(createFeedback("info", "Saving pipeline changes..."));

    const currentChannel = JSON.parse(
      JSON.stringify(passedFormChannels[passedActiveFormChannel])
    );

    const objectToSave = {
      pipelineLabel: passedLabel,
      favorite: false,
      tags: tags,
      channels: [currentChannel.name],
      default: "",
    };

    try {
      const pipeLineUpdated = await channelService.savePipeline(objectToSave);

      if (pipeLineUpdated) {
        setFormFeedback(createFeedback("success", "Pipeline saved."));
        clearForm({ keepFeedback: true });
      } else {
        setFormFeedback(
          createFeedback("error", "Pipeline save failed. Try again.")
        );
      }
    } catch (error) {
      setFormFeedback(
        createFeedback("error", "Pipeline save failed. Try again.")
      );
    }
  };

  const clearForm = (options = {}) => {
    setIsTagsModalOpn(false);
    setLabelError("");
    setTagError("");
    if (!options.keepFeedback) {
      setFormFeedback(createFeedback("info", "Draft reset."));
    }
    //Form values
    setLabel("");
    setTags([]);
    setFormChannels([]);
    setActiveFormChannel(0);
    GetInitialData();

    setPageHasLoaded(false);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    SwitchLang("en");
  };

  const addTag = (tag, passedTags) => {
    if (tag === "") {
      setTagError("Tag name is required.");
      setFormFeedback(
        createFeedback("error", "Fix the tag entry before adding it.")
      );
    } else if (passedTags.includes(tag)) {
      setTagError("Tags must be unique.");
      setFormFeedback(
        createFeedback("error", "Fix the tag entry before adding it.")
      );
    } else if (passedTags.length > 4) {
      setTagError("A pipeline can have up to 5 tags.");
      setFormFeedback(
        createFeedback("error", "Fix the tag entry before adding it.")
      );
    } else {
      const newTags = passedTags.map((tag) => tag);
      newTags.push(tag);

      setTagError("");
      setFormFeedback(createFeedback("success", "Tag added."));
      setTags(newTags);
    }
  };

  const removeTag = (tagIndex, passedTags) => {
    const newTags = passedTags.filter((tag, index) => index !== tagIndex);
    setTagError("");
    setFormFeedback(createFeedback("info", "Tag removed."));
    setTags(newTags);
  };

  const changeLang = () => {
    const langToSwitch = langLocal === "en" ? "ar" : "en";
    localStorage.setItem("lang", langToSwitch);
    SwitchLang(langToSwitch);
  };

  if (translations)
    return (
      <Fragment>
        {isTagsModalOpn && (
          <TagsModal
            tags={tags}
            closeModal={() => {
              setIsTagsModalOpn(!isTagsModalOpn);
            }}
            removeTag={removeTag}
            addTag={addTag}
          ></TagsModal>
        )}
        {isTagsModalOpn && tagError && (
          <div className="tagModalFeedback" role="alert">
            {tagError}
          </div>
        )}

        <div className="formWrapper">
          <div className="configuratorHeader">
            <div>
              <div className="eyebrowText">FlowForge Configurator</div>
              <h1 className="formTitle" htmlFor="formTitle">
                Edit pipeline settings
              </h1>
            </div>
            <ButtonComp buttonFunc={changeLang} text="Switch language" />
          </div>

          <div className="statusBar">
            <span>Mock save: ready</span>
            <span>{draftState}</span>
            <span>Language: {languageLabel}</span>
          </div>

          {formFeedback && (
            <div
              className={"formFeedback formFeedback--" + formFeedback.type}
              role={formFeedback.type === "error" ? "alert" : "status"}
            >
              {formFeedback.message}
            </div>
          )}

          <div className="formBody" htmlFor="FormBody">
            {/*  */}
            <div className="formRow">
              <div className="formRowLabel" htmlFor="Label">
                Label
              </div>
              <input
                className="inputAndSelectSizer"
                type="text"
                value={label}
                placeholder={"No Given Label"}
                onChange={(e) => {
                  setLabel(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setLabelError("");
                  }
                }}
                htmlFor="Input for Label"
                aria-invalid={labelError ? "true" : "false"}
                aria-describedby={labelError ? "labelFeedback" : undefined}
              />
            </div>
            {labelError && (
              <div className="fieldFeedback" id="labelFeedback" role="alert">
                {labelError}
              </div>
            )}

            <div className="formRowSelect">
              <div className="formRowLabel">
                {"Tags "}
                <ButtonComp
                  buttonFunc={() => setIsTagsModalOpn(!isTagsModalOpn)}
                  noLoading
                  text="Edit tags"
                />
              </div>
              <CustomOptionsSelect options={tags} isString />
            </div>
            {tagError && (
              <div className="fieldFeedback" role="alert">
                {tagError}
              </div>
            )}

            <div className="formRowSelect">
              <div className="formRowLabel">Channel</div>
              <CustomOptionsSelect
                options={formChannels}
                propertyToDisplay="name"
                onSelectFunc={setActiveFormChannel}
                placeHolderOption={<option>Select a Channel</option>}
                lastSelected={parseInt(activeFormChannel)}
              />
            </div>

            <div className="formRowButtons">
              <div className="formRowLabel"></div>
              <div className="buttonsContainer">
                <ButtonComp
                  buttonFunc={() => {
                    submitFunc(formChannels, activeFormChannel, label);
                  }}
                  text="Save pipeline"
                  disabled={activeFormChannel === null}
                />

                <ButtonComp
                  buttonFunc={clearForm}
                  grayButton
                  noLoading
                  text="Reset draft"
                />
              </div>
            </div>

            {/*  */}
          </div>
        </div>
      </Fragment>
    );
  else {
    return <div>Loading</div>;
  }
};

PipelineConfigurator.propTypes = {
  i18n: PropTypes.object.isRequired,
  channels: PropTypes.array.isRequired,
  GetInitialData: PropTypes.func.isRequired,
  SwitchLang: PropTypes.func.isRequired,
};

export default PipelineConfigurator;
