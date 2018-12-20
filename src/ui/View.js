define(function() {

    function getNodeByClassName(parentNode, className) {
        var childNode = parentNode.getElementsByClassName(className);
        if(childNode.length < 0) {
            // TODO: throw error
        }
        return childNode[0];
    }

    return {
        create: function(parentClassName) {
            var parentNode = getNodeByClassName(document.body, parentClassName);

            var currentNode = getNodeByClassName(parentNode, 'current');
            var highNode = getNodeByClassName(parentNode, 'high');
            var levelNode = getNodeByClassName(parentNode, 'level');

            return {
                current: {
                    label: getNodeByClassName(currentNode, 'label'),
                    value: getNodeByClassName(currentNode, 'value'),
                },
                high: {
                    label: getNodeByClassName(highNode, 'label'),
                    value: getNodeByClassName(highNode, 'value'),
                },
                level: {
                    label: getNodeByClassName(levelNode, 'label'),
                    value: getNodeByClassName(levelNode, 'value'),
                },
            };
        },
    };
});