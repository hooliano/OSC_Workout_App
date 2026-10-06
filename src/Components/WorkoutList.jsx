import {useEffect, useState} from 'react';
import { fetchPage } from '../fetchExercises';

export default function WorkoutList() {
    const [exercises, setExercises] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        fetchPage()
            .then(({exercises, nextPage}) => {
                setExercises(exercises);
                setNextCursor(nextPage);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function loadMore() {
        setLoadingMore(true);
        setError(null);

        try {
            const page = await fetchPage(nextCursor);
            setExercises((prev) => [...prev, ...page.exercises]);
            setNextCursor(page.nextPage);
        }
        catch(err) {
            setError(err.message);
        }
        finally {
            setLoadingMore(false);
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error && exercises.length === 0) {
        return <p>Couldn't load exercises: {error}</p>;
    }

    return (
        <section>
            <h2>Exercises ({exercises.length})</h2>
            <ul>
                {exercises.map((exercise) => (
                    <li key={exercise.exerciseId}>
                        <img src={exercise.gifUrl} alt={exercise.name} width="120"
                        height="120" loading="lazy"/>

                        <p>
                            <strong>{exercise.name}</strong>
                            <br />
                            Body Part: {exercise.bodyParts.join(', ')}
                            <br />
                            Equipment: {exercise.equipments.join(', ')}
                        </p>
                    </li>
                ))}
            </ul>

            {error && <p>Couldn't load more exercises: {error}</p>}
            {nextCursor && (
                <button onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? 'Loading...' : 'Load More'}
                </button>
            )}
        </section>
    );
}