var PipelineService = {
  getPipeline: function (channels) {
    return {
      pipelineLabel: "Default Pipeline Name",
      favorite: false,
      tags: ["development", "sales"],
      channels: channels,
      default: "",
    };
  },
  savePipeline: async function (pipelineJson) {
    console.log("Mock pipeline save", pipelineJson);
    return Promise.resolve(true);
  },
};

export default PipelineService;
