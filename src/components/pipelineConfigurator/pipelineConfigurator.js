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

const PipelineConfigurator = ({ i18n, channels, GetInitialData, SwitchLang }) => {
  const [pageHasLoaded, setPageHasLoaded] = useState(false);
  const [isTagsModalOpn, setIsTagsModalOpn] = useState(false);
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
        if (lastVals) alert("Last Values Loaded");
        setPageHasLoaded(true);
      }
    }
  }, [channels, pageHasLoaded]);

  const submitFunc = async (
    passedFormChannels,
    passedActiveFormChannel,
    passedLabel
  ) => {
    if (passedLabel.length === 0) {
      return alert("Label Can't be Empty");
    }

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

    const pipeLineUpdated = await channelService.savePipeline(objectToSave);

    if (pipeLineUpdated) {
      alert("Pipeline Updated");
      clearForm();
    } else {
      alert("Pipeline Update Failed");
    }
  };

  const clearForm = () => {
    setIsTagsModalOpn(false);
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
    if (tag === "") alert("Tag Can't be empty");
    else if (passedTags.includes(tag)) {
      alert("Cannot Add Duplicate Tags");
    } else if (passedTags.length > 4) {
      alert("Cannot Add More Than 5 Tags");
    } else {
      const newTags = passedTags.map((tag) => tag);
      newTags.push(tag);

      setTags(newTags);
    }
  };

  const removeTag = (tagIndex, passedTags) => {
    const newTags = passedTags.filter((tag, index) => index !== tagIndex);
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
                onChange={(e) => setLabel(e.target.value)}
                htmlFor="Input for Label"
              />
            </div>

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
