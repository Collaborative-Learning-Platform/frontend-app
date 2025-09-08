import { useEffect, useMemo, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	InputAdornment,
	Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
	Description as DescriptionIcon,
	DriveFileRenameOutline as RenameIcon,
} from "@mui/icons-material";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../contexts/Authcontext";

export type CreateWorkspacePayload = {
	name: string;
	description?: string;
    createdAt: string;
    createdBy: string | null;

};

type Props = {
	open: boolean;
	onClose: () => void;
	onCreated?: (workspace: any) => void;
	endpoint?: string;
	defaultValues?: Partial<CreateWorkspacePayload>;
};

export default function CreateWorkspaceModal({
	open,
	onClose,
	onCreated,
	endpoint = "/workspaces/create",
	defaultValues,
}: Props) {
	const [name, setName] = useState(defaultValues?.name ?? "");
	const [description, setDescription] = useState(defaultValues?.description ?? "");
    const {user_id} = useAuth();
	// const [visibility, setVisibility] = useState<"private" | "public">(
	// 	defaultValues?.visibility ?? "private"
	// );
	// const [allowInvites, setAllowInvites] = useState<boolean>(
	// 	defaultValues?.allowInvites ?? true
	// );
	// const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
	// const [tagInput, setTagInput] = useState("");

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	
	useEffect(() => {
		if (open) {
			setName(defaultValues?.name ?? "");
			setDescription(defaultValues?.description ?? "");
			setError(null);
		}
	}, [open, defaultValues]);

	const nameError = useMemo(() => {
		if (!name.trim()) return "Workspace name is required";
		if (name.trim().length < 3) return "Name must be at least 3 characters";
        //check if its already exists or not
		return null;
	}, [name]);

	
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (nameError) return;
		setSubmitting(true);
		setError(null);
        

		const payload: CreateWorkspacePayload = {
			name: name.trim(),
			description: description.trim() || undefined,
            createdAt: new Date().toISOString(),
            createdBy: user_id,

		};

		try {
			const res = await axiosInstance.post(endpoint, payload);
             console.log(res.data); 

            if (res.data.success == false) {
                const message = res?.data?.message || "Failed to create workspace";
                setError(message);

            }
            else if (res.data.success == true) {
                onCreated?.(res.data.data);
                onClose();
            }

		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || "Failed to create workspace";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Create Workspace</DialogTitle>
			<DialogContent sx={{ pt: 1 }}>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
				<Box component="form" id="create-workspace-form" onSubmit={handleSubmit} sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
					<TextField
						label="Workspace Name"
						placeholder="e.g., Computer Science 101"
						value={name}
						onChange={(e) => setName(e.target.value)}
						error={!!nameError}
						helperText={nameError || ""}
						required
						autoFocus
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<RenameIcon fontSize="small" />
								</InputAdornment>
							),
						}}
					/>

					<TextField
						label="Description"
						placeholder="What is this workspace about?"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						multiline
						minRows={3}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<DescriptionIcon fontSize="small" />
								</InputAdornment>
							),
						}}
					/>

				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} disabled={submitting}>
					Cancel
				</Button>
				<LoadingButton
					type="submit"
					form="create-workspace-form"
					variant="contained"
					loading={submitting}
					disabled={!!nameError}
				>
					Create
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

