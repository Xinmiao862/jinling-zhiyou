// jlzy-bus.js - 金陵智游全局数据总线
(function() {
    const state = {
        recognitionRecords: [],
        favoriteBuildings: []
    };
    try {
        const saved = localStorage.getItem('jlzy_favorites');
        if (saved) state.favoriteBuildings = JSON.parse(saved);
    } catch(e) {}

    window.JLZY = {
        addRecognitionRecord: function(buildingName, buildingInfo, confidence) {
            const record = {
                id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
                name: buildingName,
                location: buildingInfo.location,
                confidence: confidence,
                timestamp: new Date().toLocaleString('zh-CN'),
                lng: buildingInfo.lng,
                lat: buildingInfo.lat,
                isUnknown: false
            };
            state.recognitionRecords.push(record);
            window.dispatchEvent(new CustomEvent('jlzy:recognitionAdded', { detail: record }));
            console.log('[JLZY] 识别记录已添加', record);
        },
        addFavorite: function(buildingId) {
            if (!state.favoriteBuildings.includes(buildingId)) {
                state.favoriteBuildings.push(buildingId);
                localStorage.setItem('jlzy_favorites', JSON.stringify(state.favoriteBuildings));
                window.dispatchEvent(new CustomEvent('jlzy:favoriteAdded', { detail: buildingId }));
                return true;
            }
            return false;
        },
        removeFavorite: function(buildingId) {
            const idx = state.favoriteBuildings.indexOf(buildingId);
            if (idx !== -1) {
                state.favoriteBuildings.splice(idx, 1);
                localStorage.setItem('jlzy_favorites', JSON.stringify(state.favoriteBuildings));
                window.dispatchEvent(new CustomEvent('jlzy:favoriteRemoved', { detail: buildingId }));
                return true;
            }
            return false;
        },
        getFavorites: function() {
            return [...state.favoriteBuildings];
        },
        getAllRecognitionRecords: function() {
            return [...state.recognitionRecords];
        }
    };
})();