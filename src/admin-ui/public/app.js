const { createApp, ref, onMounted, computed, watch } = Vue;

createApp({
    setup() {
        const config = ref({
            mode: 'off',
            caseSensitive: true,
            policies: []
        });
        const originalConfig = ref(null);
        const isModalOpen = ref(false);
        const modalPosition = ref('top');
        const logs = ref([]);
        const isFetchingLogs = ref(false);
        const logFilterTool = ref('');
        const logFilterSession = ref('');
        const logFilterAccessResult = ref('');
        const policyFilterType = ref('');
        const policyFilterTool = ref('');
        const policyFilterSession = ref('');
        const hints = ref({
            toolNames: [],
            sessionKeys: []
        });
        const hasUnsavedChanges = ref(false);

        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/config_local_only');
                const data = await res.json();
                data.policies.forEach(p => {
                    Object.defineProperty(p, 'toolNameRaw', { value: p.toolName.join(', '), writable: true, enumerable: false, configurable: true });
                    Object.defineProperty(p, 'sessionKeyRaw', { value: p.sessionKey.join(', '), writable: true, enumerable: false, configurable: true });
                });
                config.value = data;
                originalConfig.value = JSON.parse(JSON.stringify(data));
                hasUnsavedChanges.value = false;
            } catch (e) {
                console.error('Failed to fetch config:', e);
            }
        };

        const fetchHints = async () => {
            try {
                const res = await fetch('/api/logs?hints=true');
                const data = await res.json();
                hints.value = data;
            } catch (e) {
                console.error('Failed to fetch hints:', e);
            }
        };

        const fetchLogs = async () => {
            isFetchingLogs.value = true;
            try {
                const res = await fetch('/api/logs');
                const data = await res.json();
                logs.value = data.logs || [];
                await fetchHints();
            } catch (e) {
                console.error('Failed to fetch logs:', e);
            } finally {
                isFetchingLogs.value = false;
            }
        };

        const saveConfig = async () => {
            try {
                const res = await fetch('/api/config_local_only', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config.value)
                });
                if (res.ok) {
                    originalConfig.value = JSON.parse(JSON.stringify(config.value));
                    hasUnsavedChanges.value = false;
                    Swal.fire({
                        title: 'Saved!',
                        text: 'Configuration successfully updated.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            } catch (e) {
                Swal.fire('Error', 'Failed to save configuration', 'error');
            }
        };

        const undoChanges = () => {
            if (originalConfig.value) {
                config.value = JSON.parse(JSON.stringify(originalConfig.value));
                hasUnsavedChanges.value = false;
            }
        };

        const markDirty = () => {
            hasUnsavedChanges.value = true;
        };

        const openLogModal = (position = 'top') => {
            isModalOpen.value = true;
            modalPosition.value = position;
            fetchLogs();
        };

        const closeLogModal = () => {
            isModalOpen.value = false;
        };

        const addPolicy = (position = 'top') => {
            const newPolicy = {
                type: 'grant',
                toolName: [],
                sessionKey: [],
                condition: '',
                desc: ''
            };
            Object.defineProperty(newPolicy, 'toolNameRaw', { value: '', writable: true, enumerable: false, configurable: true });
            Object.defineProperty(newPolicy, 'sessionKeyRaw', { value: '', writable: true, enumerable: false, configurable: true });
            if (position === 'top') {
                config.value.policies.unshift(newPolicy);
            } else {
                config.value.policies.push(newPolicy);
            }
            markDirty();
        };

        const deletePolicy = (index) => {
            config.value.policies.splice(index, 1);
            markDirty();
        };

        const updateField = (obj, key, value) => {
            obj[key] = value;
            markDirty();
        };

        const updateArray = (policy, key, value) => {
            policy[key + 'Raw'] = value;
            policy[key] = value.split(',').map(s => s.trim()).filter(Boolean);
            markDirty();
        };

        const filteredLogs = computed(() => {
            return logs.value.filter(log => {
                if (logFilterTool.value && log.toolName !== logFilterTool.value) return false;
                if (logFilterSession.value && log.sessionKey !== logFilterSession.value) return false;
                if (logFilterAccessResult.value && log.accessResult !== logFilterAccessResult.value) return false;
                return true;
            });
        });

        const filteredPolicies = computed(() => {
            return config.value.policies.map((p, originalIndex) => ({ p, originalIndex }))
                .filter(item => {
                    const p = item.p;
                    if (policyFilterType.value && p.type !== policyFilterType.value) return false;
                    
                    // Match if the tool filter is in the toolName array or toolName contains '*'
                    if (policyFilterTool.value) {
                        const hasTool = p.toolName.includes(policyFilterTool.value) || p.toolName.includes('*');
                        if (!hasTool) return false;
                    }
                    
                    // Match if the session filter is in the sessionKey array or sessionKey contains '*'
                    if (policyFilterSession.value) {
                        const hasSession = p.sessionKey.includes(policyFilterSession.value) || p.sessionKey.includes('*');
                        if (!hasSession) return false;
                    }
                    
                    return true;
                });
        });

        const policyTypeOptions = computed(() => ['grant', 'deny']);
        const policyToolOptions = computed(() => {
            const set = new Set();
            config.value.policies.forEach(p => p.toolName.forEach(t => set.add(t)));
            return Array.from(set).sort();
        });
        const policySessionOptions = computed(() => {
            const set = new Set();
            config.value.policies.forEach(p => p.sessionKey.forEach(s => set.add(s)));
            return Array.from(set).sort();
        });

        const tempId = (log, i) => `${log.timestamp}-${i}`;

        const addFromLog = (log, flavor) => {
            let policy = {
                type: 'grant',
                condition: ''
            };

            switch (flavor) {
                case 'tool':
                    policy.toolName = [log.toolName];
                    policy.sessionKey = ['*'];
                    policy.desc = `${log.toolName}-added from log`;
                    break;
                case 'tool_session':
                    policy.toolName = [log.toolName];
                    policy.sessionKey = [log.sessionKey || '*'];
                    policy.desc = `${log.toolName}-${log.sessionKey || '*'}-added from log`;
                    break;
                case 'request':
                    policy.toolName = [log.toolName];
                    policy.sessionKey = [log.sessionKey || '*'];
                    policy.desc = `${log.toolName}-${log.sessionKey || '*'}-added from log`;
                    
                    // Build a detailed condition from parameters
                    if (log.params && typeof log.params === 'object') {
                        const conditions = [];
                        for (const [key, value] of Object.entries(log.params)) {
                            if (typeof value === 'string') {
                                conditions.push(`params.${key} == '${value.replace(/'/g, "\\'")}'`);
                            } else if (typeof value === 'number' || typeof value === 'boolean') {
                                conditions.push(`params.${key} == ${value}`);
                            } else if (value === null) {
                                conditions.push(`params.${key} == null`);
                            }
                        }
                        policy.condition = conditions.join(' and ');
                    }
                    break;
            }

            if (!policy.toolName) policy.toolName = ['*'];
            if (!policy.sessionKey) policy.sessionKey = ['*'];

            Object.defineProperty(policy, 'toolNameRaw', { value: policy.toolName.join(', '), writable: true, enumerable: false, configurable: true });
            Object.defineProperty(policy, 'sessionKeyRaw', { value: policy.sessionKey.join(', '), writable: true, enumerable: false, configurable: true });

            if (modalPosition.value === 'top') {
                config.value.policies.unshift(policy);
            } else {
                config.value.policies.push(policy);
            }
            markDirty();
            closeLogModal();
            
            Swal.fire({
                title: 'Added!',
                text: 'New policy created from log entry.',
                icon: 'info',
                timer: 1000,
                showConfirmButton: false
            });
        };

        onMounted(() => {
            fetchConfig();
            fetchHints();
        });

        return {
            config,
            isModalOpen,
            isFetchingLogs,
            logFilterTool,
            logFilterSession,
            logFilterAccessResult,
            policyFilterType,
            policyFilterTool,
            policyFilterSession,
            hints,
            hasUnsavedChanges,
            saveConfig,
            undoChanges,
            markDirty,
            openLogModal,
            closeLogModal,
            fetchLogs,
            addPolicy,
            deletePolicy,
            updateField,
            updateArray,
            filteredLogs,
            filteredPolicies,
            policyTypeOptions,
            policyToolOptions,
            policySessionOptions,
            tempId,
            addFromLog,
            modalPosition
        };
    }
}).mount('#app');
